import browser from 'webextension-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { DEFAULT_ID } from '../../../IO/message-port'
import TabBar from '../../../commons/components/TabBar'
import Input from '../../../commons/components/Input'
import Checkbox from '../../../commons/components/Checkbox'
import FlatButton from '../../../commons/components/FlatButton'
import Link from '../../../commons/components/Link'
import '../../styles/options.css'
import '../../../commons/styles/elements.css'

const Tabs = {
  TESTS: 'Tests',
  ACCOUNT: 'Account',
  ADVANCED: 'Advanced',
}

class Options extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: Tabs.TESTS,
      enableDomCapture: true,
      enableVisualCheckpoints: true,
      apiKey: '',
      eyesServer: '',
      seideId: '',
    }
    this.tabs = Object.values(Tabs)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.saveOptions = this.saveOptions.bind(this)
    browser.storage.local
      .get([
        'enableDomCapture',
        'enableVisualCheckpoints',
        'enableLegacyDomSnapshot',
        'openUrls',
        'apiKey',
        'eyesServer',
        'seideId',
        'experimentalEnabled',
      ])
      .then(
        ({
          enableDomCapture,
          enableVisualCheckpoints,
          enableLegacyDomSnapshot,
          openUrls,
          apiKey,
          eyesServer,
          seideId,
          experimentalEnabled,
        }) => {
          this.setState({
            enableDomCapture,
            enableVisualCheckpoints,
            openUrls,
            apiKey: apiKey || '',
            eyesServer: eyesServer || '',
            seideId: seideId || '',
            experimentalEnabled: experimentalEnabled || false,
            enableLegacyDomSnapshot: enableLegacyDomSnapshot || false,
          })
        }
      )
  }
  handleTabChange(tab) {
    this.setState({
      tab,
    })
  }
  handleCheckboxChange(name, e) {
    this.setState({
      [name]: e.target.checked,
    })
  }
  handleInputChange(name, value) {
    this.setState({
      [name]: value,
    })
  }
  saveOptions() {
    browser.storage.local
      .set({
        enableDomCapture: this.state.enableDomCapture,
        enableVisualCheckpoints: this.state.enableVisualCheckpoints,
        openUrls: this.state.openUrls,
        apiKey: this.state.apiKey,
        eyesServer: this.state.eyesServer,
        seideId: this.state.seideId,
        experimentalEnabled: this.state.experimentalEnabled,
        enableLegacyDomSnapshot: this.state.enableLegacyDomSnapshot,
      })
      .then(() => {
        browser.runtime.sendMessage({
          optionsUpdated: true,
        })
        window.close()
      })
  }
  render() {
    return (
      <div>
        <TabBar tabs={this.tabs} tabChanged={this.handleTabChange} />
        <form
          onSubmit={e => {
            e.preventDefault()
          }}
        >
          <div className="form-contents">
            {this.state.tab === Tabs.TESTS && (
              <React.Fragment>
                <Checkbox
                  id="enable-checks"
                  className="checkbox"
                  name="enable-checks"
                  label="Enable visual checkpoints"
                  checked={this.state.enableVisualCheckpoints}
                  onChange={this.handleCheckboxChange.bind(this, 'enableVisualCheckpoints')}
                />
                <Checkbox
                  id="enable-dom-capture"
                  className="checkbox"
                  name="enable-dom-capture"
                  label="Root cause analysis enabled"
                  checked={this.state.enableDomCapture}
                  onChange={this.handleCheckboxChange.bind(this, 'enableDomCapture')}
                />
                <Checkbox
                  id="open-urls"
                  className="checkbox"
                  name="open-urls"
                  label="Open test manager after test runs"
                  checked={this.state.openUrls}
                  onChange={this.handleCheckboxChange.bind(this, 'openUrls')}
                />
                {this.state.experimentalEnabled ? (
                  <Checkbox
                    id="enable-legacy-dom-snapshot"
                    className="checkbox"
                    name="enable-legacy-dom-snapshot"
                    label="Enable legacy DOM snapshot for the visual grid"
                    checked={this.state.enableLegacyDomSnapshot}
                    onChange={this.handleCheckboxChange.bind(this, 'enableLegacyDomSnapshot')}
                    disclaimer="(not supported in the SIDE command-line-runner)"
                  />
                ) : (
                  undefined
                )}
              </React.Fragment>
            )}
            {this.state.tab === Tabs.ACCOUNT && (
              <React.Fragment>
                <Input
                  name="apiKey"
                  label="api key"
                  value={this.state.apiKey}
                  onChange={this.handleInputChange.bind(this, 'apiKey')}
                />
                <Input
                  name="serverUrl"
                  label="server url"
                  placeholder="https://eyes.applitools.com"
                  value={this.state.eyesServer}
                  onChange={this.handleInputChange.bind(this, 'eyesServer')}
                />
                <Link className="secondary" href="https://applitools.com/docs/topics/overview/obtain-api-key.html">
                  How to obtain your API key
                </Link>
              </React.Fragment>
            )}
            {this.state.tab === Tabs.ADVANCED && (
              <React.Fragment>
                <p>
                  This extension connects with the Selenium IDE extension of the ID shown below. If you are using a
                  Selenium IDE version with a different ID (as listed in the extensions page of your browser) please set
                  it here.
                </p>
                <Input
                  name="seideId"
                  label="ide extension id"
                  placeholder={DEFAULT_ID}
                  value={this.state.seideId}
                  onChange={this.handleInputChange.bind(this, 'seideId')}
                />
                <Checkbox
                  id="experimental"
                  className="checkbox"
                  name="experimental"
                  label="Enable experimental features"
                  checked={this.state.experimentalEnabled}
                  onChange={this.handleCheckboxChange.bind(this, 'experimentalEnabled')}
                />
              </React.Fragment>
            )}
          </div>
          <FlatButton type="submit" onClick={this.saveOptions}>
            Confirm
          </FlatButton>
          <div style={{ clear: 'both' }} />
        </form>
      </div>
    )
  }
}

ReactDOM.render(<Options />, document.getElementById('root'))
