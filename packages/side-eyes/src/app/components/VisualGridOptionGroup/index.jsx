import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import ArrowIndicator from '../../../commons/components/ArrowIndicator'
import './style.css'

export default class VisualGridOptionGroup extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    selectedCount: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = { isSelected: false }
  }

  onClick() {
    this.setState({ isSelected: !this.state.isSelected })
  }

  render() {
    return (
      <div className="group">
        <div className={classNames('group-header', this.props.name.toLowerCase())} onClick={this.onClick.bind(this)}>
          <div className="title">{this.props.name}</div>
          <div className="selected-count">{this.props.selectedCount}</div>
          <div className="control">
            <ArrowIndicator directionIsUp={this.state.isSelected} />
          </div>
        </div>
        {this.state.isSelected && <div className="contents">{this.props.children}</div>}
      </div>
    )
  }
}
