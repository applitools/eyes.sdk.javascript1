import browser from 'webextension-polyfill'
import UAParser from 'ua-parser-js'
import React from 'react'
import Modes from '../../../commons/modes'
import Disconnect from '../Disconnect'
import Normal from '../Normal'
import Setup from '../Setup'
import Record from '../Record'
import Playback from '../Playback'
import SpinnerBanner, { SpinnerStates } from '../../components/SpinnerBanner'
import DisconnectBanner from '../../components/DisconnectBanner'
import '../../../commons/styles/elements.css'
import '../../styles/app.css'

const userAgent = UAParser(window.navigator.userAgent)
if (userAgent.browser.name === 'Chrome') {
  require('../../../commons/styles/chrome.css')
}
if (userAgent.os.name === 'Windows') {
  require('../../../commons/styles/windows.css')
}

export default class Panel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: Modes.NORMAL,
      enableVisualCheckpoints: true,
      isSubmitting: false,
      projectId: '',
    }
    browser.runtime
      .sendMessage({
        requestExternalState: true,
      })
      .then(({ state }) => {
        this.setState(state)
      })
    browser.runtime.sendMessage({ requestProject: true }).then(({ project }) => {
      this.setState({ projectId: project.id })
    })
    this.setExternalState = this.setExternalState.bind(this)
    this.visualCheckpointsChanged = this.visualCheckpointsChanged.bind(this)
    this.setSubmitting = this.setSubmitting.bind(this)
  }
  componentDidMount() {
    // BEWARE CONVOLUTED API AHEAD!!!
    // When using onMessage or onMessageExternal listeners only one response can
    // be returned, or else it will throw (sometimes throw in a different message at all!)
    // When returning in the listener, the listener will treat this as the response:
    // return 5 is the same as sendResponse(5)
    // For that reason async operations are convoluted, if foo is async then this:
    // return foo().then(sendRespnse) will throw, because foo returns a promise
    // which will be used as the response value, and when the promise resolves
    // another value is returned using sendResponse
    // To use async operations with onMessage, return true, this will inform chrome
    // to wait until the sendResponse callback is explicitly called, which results in:
    // foo().then(sendResponse); return true
    // PASTE THIS IN EVERY PLACE THAT LISTENS TO onMessage!!
    browser.runtime.onMessage.addListener(this.setExternalState)
  }
  componentWillUnmount() {
    browser.runtime.onMessage.removeListener(this.setExternalState)
  }
  setExternalState(message, _backgroundPage, _sendResponse) {
    // eslint-disable-line no-unused-vars
    if (message.state) {
      this.setState(Object.assign({ isSubmitting: false }, message.state))
    }
  }
  visualCheckpointsChanged(value) {
    browser.runtime
      .sendMessage({
        setVisualChecks: true,
        enableVisualCheckpoints: value,
      })
      .catch()
  }
  setSubmitting() {
    this.setState({
      mode: Modes.SETUP,
      isSubmitting: true,
    })
  }
  render() {
    return (
      <div>
        {this.state.mode === Modes.DISCONNECTED && <DisconnectBanner />}
        {this.state.mode === Modes.NORMAL &&
          (this.state.enableVisualCheckpoints ? (
            <SpinnerBanner state={SpinnerStates.SUCCESS} spin={false}>
              Successfully connected with Selenium IDE
            </SpinnerBanner>
          ) : (
            <SpinnerBanner state={SpinnerStates.ERROR} spin={false}>
              Visual checkpoints are disabled.
            </SpinnerBanner>
          ))}
        {this.state.mode === Modes.SETUP &&
          (!this.state.isSubmitting ? (
            <SpinnerBanner state={SpinnerStates.ERROR} spin={false}>
              Applitools account details are not set!
            </SpinnerBanner>
          ) : (
            <SpinnerBanner state={SpinnerStates.ERROR}>Verifying account details...</SpinnerBanner>
          ))}
        {this.state.mode === Modes.INVALID && (
          <SpinnerBanner state={SpinnerStates.ERROR} spin={false}>
            Unable to verify Applitools account details!
          </SpinnerBanner>
        )}
        {this.state.mode === Modes.RECORD && (
          <SpinnerBanner state={SpinnerStates.SUCCESS}>{`Recording test: ${this.state.record.testName}`}</SpinnerBanner>
        )}
        {this.state.mode === Modes.PLAYBACK && (
          <SpinnerBanner state={SpinnerStates.SUCCESS}>{`Running test: ${this.state.playback.testName}`}</SpinnerBanner>
        )}
        <div className="container">
          {this.state.mode === Modes.DISCONNECTED && <Disconnect />}
          {this.state.mode === Modes.NORMAL &&
            (this.state.projectId ? (
              <Normal
                enableVisualCheckpoints={this.state.enableVisualCheckpoints}
                visualCheckpointsChanged={this.visualCheckpointsChanged}
                projectId={this.state.projectId}
              />
            ) : (
              undefined
            ))}
          {(this.state.mode === Modes.SETUP || this.state.mode === Modes.INVALID) && (
            <Setup isInvalid={this.state.mode === Modes.INVALID} setSubmitMode={this.setSubmitting} />
          )}
          {this.state.mode === Modes.RECORD && <Record />}
          {this.state.mode === Modes.PLAYBACK && (
            <Playback
              testName={this.state.playback.testName}
              startTime={new Date(this.state.playback.startTime)}
              hasFailed={this.state.playback.hasFailed}
              batchName={this.state.playback.batchName}
              appName={this.state.playback.appName}
              eyesServer={this.state.playback.eyesServer}
              environment={this.state.playback.environment}
              branch={this.state.playback.branch}
            />
          )}
        </div>
      </div>
    )
  }
}
