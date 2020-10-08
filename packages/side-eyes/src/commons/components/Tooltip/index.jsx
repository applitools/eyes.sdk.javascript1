import React from 'react'
import ReactTooltip from 'react-tooltip'
import './style.css'

export default class Tooltip extends React.Component {
  render() {
    return <ReactTooltip className="eyes-tooltip" place="bottom" effect="solid" html={true} {...this.props} />
  }
}

export const rebuild = ReactTooltip.rebuild
