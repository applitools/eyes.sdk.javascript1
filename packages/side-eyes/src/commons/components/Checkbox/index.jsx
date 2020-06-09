import React from 'react'
import PropTypes from 'prop-types'
import './style.css'

export default class Checkbox extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    label: PropTypes.string,
    width: PropTypes.number,
    checked: PropTypes.bool,
    isChecked: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    disclaimer: PropTypes.string,
  }
  render() {
    const checked =
      this.props.checked ||
      (this.props.hasOwnProperty('checked') && this.props.checked !== false) ||
      (this.props.hasOwnProperty('isChecked') && this.props.isChecked())
    return (
      <div className="control">
        <input
          type="checkbox"
          className="checkbox"
          id={this.props.id}
          name={this.props.name}
          checked={checked}
          onChange={this.props.onChange}
        />
        <label key="label" htmlFor={this.props.id}>
          <span>{checked ? '✓' : ''}</span>
          <div>{this.props.label}</div>
          {this.props.disclaimer ? <div className="disclaimer">{this.props.disclaimer}</div> : undefined}
        </label>
      </div>
    )
  }
}
