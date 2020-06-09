import React from 'react'
import PropTypes from 'prop-types'
import FormLabel from '../../../commons/components/FormLabel'
import Timer from '../../../commons/components/Timer'
import { DEFAULT_API_SERVER } from '../../../commons/api.js'
import './style.css'

export default class PlaybackBanner extends React.Component {
  static propTypes = {
    testName: PropTypes.string.isRequired,
    startTime: PropTypes.instanceOf(Date).isRequired,
    hasFailed: PropTypes.bool,
    batchName: PropTypes.string,
    appName: PropTypes.string,
    eyesServer: PropTypes.string,
    environment: PropTypes.string,
    branch: PropTypes.string,
  }
  render() {
    return (
      <div>
        <div className="playback-info">
          <FormLabel label="Batch name">{this.props.batchName}</FormLabel>
          <FormLabel label="App name">{this.props.appName}</FormLabel>
          <FormLabel label="Eyes server" placeholder={DEFAULT_API_SERVER}>
            {this.props.eyesServer}
          </FormLabel>
          <FormLabel label="Environment" placeholder="Undetermined">
            {this.props.environment}
          </FormLabel>
          <FormLabel label="Branch" placeholder="default">
            {this.props.branch}
          </FormLabel>
          <FormLabel label="Started at">
            {`${this.props.startTime.getHours()}:${this.props.startTime.getMinutes()}`} (
            <Timer time={this.props.startTime} />)
          </FormLabel>
        </div>
      </div>
    )
  }
}
