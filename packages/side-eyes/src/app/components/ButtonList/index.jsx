import React from 'react'
import PropTypes from 'prop-types'
import './style.css'

export default class ButtonList extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    label: PropTypes.string,
    onClick: PropTypes.func.isRequired,
  }
  render() {
    return (
      <ul className="buttons">
        {this.props.items.map(item => (
          <ListButton key={item} name={item} label={this.props.label} onClick={this.props.onClick} />
        ))}
      </ul>
    )
  }
}

class ListButton extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.state = { label: props.label, selectedCommand: false }
  }
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    onClick: PropTypes.func.isRequired,
  }
  async displaySelectedNotification() {
    this.setState({ label: '✓ Added to test', selectedCommand: true })
    await new Promise(resolve => setTimeout(resolve, 1000))
    this.setState({ selectedCommand: false })
    await new Promise(resolve => setTimeout(resolve, 200))
    this.setState({ label: this.props.label })
  }
  handleClick() {
    this.props.onClick(this.props.name)
    this.displaySelectedNotification()
  }
  render() {
    return (
      <li tabIndex="0" onClick={this.handleClick}>
        <button tabIndex="-1">{this.props.name}</button>
        {this.state.label && (
          <a className={this.state.selectedCommand ? 'selected-command' : undefined}>{this.state.label}</a>
        )}
      </li>
    )
  }
}
