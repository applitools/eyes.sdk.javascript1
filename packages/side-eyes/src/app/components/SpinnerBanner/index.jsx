import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import tick from '../../assets/images/tick.png'
import warning from '../../assets/images/warning.png'
import './style.css'

export const SpinnerStates = {
  SUCCESS: 'success',
  SETUP: 'setup',
  ERROR: 'error',
}

const StatusImages = {
  [SpinnerStates.SUCCESS]: tick,
  [SpinnerStates.ERROR]: warning,
}

export default class SpinnerBanner extends React.Component {
  constructor(props) {
    super(props)
    this.renderSpinner = this.renderSpinner.bind(this)
  }
  static propTypes = {
    children: PropTypes.node,
    spin: PropTypes.bool,
    state: PropTypes.oneOf(Object.values(SpinnerStates)).isRequired,
    style: PropTypes.object,
  }
  static defaultProps = {
    spin: true,
  }
  renderSpinner(style) {
    return (
      <div className={classNames('banner', this.props.state)} style={Object.assign({}, this.props.style, style)}>
        {this.props.spin && <span className="loader" />}
        {!this.props.spin &&
          (StatusImages[this.props.state] ? (
            <img width="32px" src={StatusImages[this.props.state]} style={{ marginRight: '10px' }} />
          ) : (
            <span className="loader stopped" />
          ))}
        <span>{this.props.children}</span>
      </div>
    )
  }
  render() {
    return (
      <React.Fragment>
        {this.renderSpinner({ position: 'fixed' })}
        {this.renderSpinner()}
      </React.Fragment>
    )
  }
}
