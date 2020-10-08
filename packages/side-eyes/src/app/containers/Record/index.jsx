import browser from 'webextension-polyfill'
import React from 'react'
import { sendMessage } from '../../../IO/message-port'
import ButtonList from '../../components/ButtonList'
import { CommandIds } from '../../../commons/commands'

export default class Record extends React.Component {
  constructor(props) {
    super(props)
    this.commands = {
      ['Check window']: {
        command: CommandIds.CheckWindow,
        target: '',
        value: '',
      },
      ['Check element']: {
        command: CommandIds.CheckElement,
        target: '',
        value: '',
        select: true,
      },
      ['Set viewport size']: {
        command: CommandIds.SetViewportSize,
        target: '1280x800',
        value: '',
      },
      ['Set match timeout']: {
        command: CommandIds.SetMatchTimeout,
        target: '2000',
        value: '',
      },
      ['Set match level']: {
        command: CommandIds.SetMatchLevel,
        target: 'Strict',
        value: '',
      },
    }
    this.handleCommandClick = this.handleCommandClick.bind(this)
  }
  handleCommandClick(command) {
    if (command === 'Set viewport size') {
      return sendMessage({
        uri: '/record/tab',
        verb: 'get',
      }).then(res => {
        if (res.error === 'No active tab found') {
          return browser.runtime.sendMessage({
            recordCommand: true,
            command: this.commands[command],
          })
        } else {
          return browser.tabs.get(res.id).then(tab => {
            return browser.runtime.sendMessage({
              recordCommand: true,
              command: {
                command: CommandIds.SetViewportSize,
                target: `${tab.width}x${Math.max(tab.height - 100, 100)}`,
                value: '',
              },
            })
          })
        }
      })
    } else {
      return browser.runtime.sendMessage({
        recordCommand: true,
        command: this.commands[command],
      })
    }
  }
  render() {
    return (
      <div>
        <p
          style={{
            padding: '0 3px',
          }}
        >
          You can use the following Eyes commands in Selenium IDE or click them while recording your test:
        </p>
        <ButtonList items={Object.keys(this.commands)} label="Add to test" onClick={this.handleCommandClick} />
      </div>
    )
  }
}
