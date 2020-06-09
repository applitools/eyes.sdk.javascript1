import browser from 'webextension-polyfill'
import React from 'react'
import PropTypes from 'prop-types'
import Link from '../../../commons/components/Link'
import Input from '../../../commons/components/Input'
import FlatButton from '../../../commons/components/FlatButton'
import './style.css'

export default class Setup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      apiKey: '',
      serverUrl: '',
    }
    this.handleApiKeyChange = this.handleApiKeyChange.bind(this)
    this.handleServerUrlChange = this.handleServerUrlChange.bind(this)
    this.submitInfo = this.submitInfo.bind(this)
    browser.storage.local.get(['apiKey', 'eyesServer']).then(({ apiKey, eyesServer }) => {
      this.setState({
        apiKey: apiKey || this.state.apiKey,
        eyesServer: eyesServer || this.state.serverUrl,
      })
    })
  }
  static propTypes = {
    isInvalid: PropTypes.bool,
    setSubmitMode: PropTypes.func,
  }
  handleApiKeyChange(value) {
    this.setState({ apiKey: value })
  }
  handleServerUrlChange(value) {
    this.setState({ serverUrl: value })
  }
  submitInfo() {
    if (this.props.setSubmitMode) {
      this.props.setSubmitMode()
    }
    browser.storage.local
      .set({
        apiKey: this.state.apiKey,
        eyesServer: this.state.serverUrl,
      })
      .then(() => {
        browser.runtime.sendMessage({
          optionsUpdated: true,
        })
      })
  }
  render() {
    return (
      <div>
        <form
          className="setup"
          onSubmit={e => {
            e.preventDefault()
          }}
        >
          <p>
            <Link href="https://applitools.com/users/register">Sign up for a free account</Link> if you don’t already
            have one, or see{' '}
            <Link href="https://applitools.com/docs/topics/overview/obtain-api-key.html">
              How to obtain your API key
            </Link>
          </p>
          <Input name="apiKey" label="API key" value={this.state.apiKey} onChange={this.handleApiKeyChange} />
          <Input
            name="serverUrl"
            label="Server URL"
            placeholder="https://eyes.applitools.com"
            value={this.state.serverUrl}
            onChange={this.handleServerUrlChange}
          />
          <FlatButton
            type="submit"
            onClick={this.submitInfo}
            style={{
              float: 'right',
              margin: '15px 0',
            }}
          >
            Apply
          </FlatButton>
        </form>
      </div>
    )
  }
}
