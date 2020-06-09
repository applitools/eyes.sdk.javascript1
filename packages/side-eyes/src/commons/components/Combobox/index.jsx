import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Modal from '../Modal'
import ArrowIndicator from '../ArrowIndicator'
import './style.css'

export default class Combobox extends React.Component {
  static propTypes = {
    selectedItem: PropTypes.string,
    items: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    className: PropTypes.string,
  }
  constructor(props) {
    super(props)
    const selectedItemIndex = props.items.indexOf(props.selectedItem)
    this.state = {
      selectedIndex: selectedItemIndex !== -1 ? selectedItemIndex : 0,
      isOpen: false,
    }
  }
  click(item, index) {
    this.setState({ selectedIndex: index })
    this.props.onChange(item)
    this.closeCombobox()
  }
  openCombobox() {
    if (!this.props.disabled) {
      this.setState({ isOpen: true })
    }
  }
  closeCombobox() {
    this.setState({ isOpen: false })
  }
  calculateModalPosition() {
    const rect = this.button ? this.button.getBoundingClientRect() : { top: 0, left: 0 }
    return {
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      bottom: 'initial',
      right: 'initial',
    }
  }
  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
        }}
        className={this.props.className}
      >
        {this.props.label && <div>{this.props.label}</div>}
        <a
          className={classNames('combobox', { disabled: this.props.disabled })}
          ref={button => {
            this.button = button
          }}
          href="#"
          onClick={this.openCombobox.bind(this)}
        >
          <React.Fragment>
            <span style={{ marginRight: '5px' }}>{this.props.items[this.state.selectedIndex]}</span>
            <ArrowIndicator directionIsUp={this.state.isOpen} />
          </React.Fragment>
        </a>
        <Modal
          modalIsOpen={this.state.isOpen}
          onRequestClose={this.closeCombobox.bind(this)}
          customStyles={{
            content: { padding: '5px 0', ...this.calculateModalPosition() },
          }}
        >
          <ul className="combobox-content">
            {this.props.items.map((item, index) => (
              <li key={item} name={item} label={this.props.label} onClick={this.props.onClick}>
                <a className="combobox-item" href="#" onClick={() => this.click(item, index)}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </Modal>
      </div>
    )
  }
}
