import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style.css'

export default class TabBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab: props.defaultTab
        ? {
            tab: props.defaultTab,
            index: props.tabs.indexOf(props.defaultTab),
          }
        : {
            tab: props.tabs[0],
            index: 0,
          },
    }
    this.recalculatePadding = this.recalculatePadding.bind(this)
  }
  static propTypes = {
    tabs: PropTypes.array.isRequired,
    defaultTab: PropTypes.string,
    tabWidth: PropTypes.number,
    tabChanged: PropTypes.func,
  }
  static defaultProps = {
    tabWidth: 80,
  }
  handleClick(tab, index) {
    if (tab !== this.state.activeTab.tab) {
      this.setState({
        activeTab: { tab, index },
      })
      if (this.props.tabChanged) this.props.tabChanged(tab)
    }
  }
  recalculatePadding(node) {
    const tabPadding = Math.round(node.getBoundingClientRect().width / this.props.tabs.length - this.props.tabWidth)
    if (tabPadding !== this.state.tabPadding) {
      this.setState({ tabPadding })
    }
  }
  render() {
    const underlineX =
      this.state.activeTab.index * (this.props.tabWidth + this.state.tabPadding) + this.state.tabPadding / 2
    return (
      <div className="tabbar">
        <ul
          ref={node => {
            if (node) {
              // Chrome resizes the frame after rendering, so we calculate twice
              setTimeout(() => {
                this.recalculatePadding(node)
              }, 100)
              this.recalculatePadding(node)
            }
          }}
        >
          {this.props.tabs.map((tab, index) => (
            <li
              key={tab}
              className={classNames({
                active: tab === this.state.activeTab.tab,
              })}
            >
              <a onClick={this.handleClick.bind(this, tab, index)}>{tab}</a>
            </li>
          ))}
        </ul>
        <div
          className="underline"
          style={{
            transform: `translateX(${underlineX}px)`,
            width: `${this.props.tabWidth}px`,
          }}
        />
      </div>
    )
  }
}
