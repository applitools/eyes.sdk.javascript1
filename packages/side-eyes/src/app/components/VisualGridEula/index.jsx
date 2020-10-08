import React from 'react'
import PropTypes from 'prop-types'
import FlatButton from '../../../commons/components/FlatButton'

export default class VisualGridEula extends React.Component {
  static propTypes = {
    onEulaSigned: PropTypes.func.isRequired,
  }
  render() {
    return (
      <div className="disclaimer">
        <p>Visual Grid functionality allows parallel, cross-browser, multi viewport, ultra-fast visual testing.</p>
        <p>This functionality is offered as a free trial until March 31, 2019.</p>
        <FlatButton full onClick={this.props.onEulaSigned}>
          I Understand
        </FlatButton>
      </div>
    )
  }
}
