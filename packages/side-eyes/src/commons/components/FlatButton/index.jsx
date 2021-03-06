import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style.css'

export default class FlatButton extends React.Component {
  static propTypes = {
    buttonRef: PropTypes.func,
  }
  render() {
    const full = this.props.full || (this.props.hasOwnProperty('full') && this.props.full !== false)
    const props = { ...this.props }
    delete props.buttonRef
    delete props.full
    return (
      <button
        type="button"
        ref={this.props.buttonRef}
        {...props}
        className={classNames('btn', { 'btn-full': full }, this.props.className)}
      />
    )
  }
}
