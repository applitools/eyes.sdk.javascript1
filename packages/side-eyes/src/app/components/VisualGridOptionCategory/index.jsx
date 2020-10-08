import React from 'react'
import PropTypes from 'prop-types'
import AddButton from '../ActionButtons/AddButton'
import VisualGridOptionSelector from '../VisualGridOptionSelector'
import VisualGridSelectedOptions from '../VisualGridSelectedOptions'
import './style.css'

export default class VisualGridOptionCategory extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    errorMessage: PropTypes.string,
    modalIsOpen: PropTypes.bool.isRequired,
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
    modalStyles: PropTypes.object.isRequired,
    options: PropTypes.array.isRequired,
    selectedOptions: PropTypes.array.isRequired,
    removeOption: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isSearch: PropTypes.bool,
  }

  render() {
    return (
      <React.Fragment>
        <div className="option-header">
          <div className="title">{this.props.name}</div>
          <AddButton onClick={this.props.modalOpen} isSelected={this.props.modalIsOpen} />
          <VisualGridOptionSelector
            modalIsOpen={this.props.modalIsOpen}
            modalClose={this.props.modalClose}
            options={this.props.options}
            selectedOptions={this.props.selectedOptions}
            onSubmit={this.props.onSubmit}
            customStyles={this.props.modalStyles}
            isSearch={this.props.isSearch}
          />
        </div>
        {this.props.selectedOptions.length ? (
          <VisualGridSelectedOptions items={this.props.selectedOptions} removeOption={this.props.removeOption} />
        ) : this.props.errorMessage ? (
          <div className="error-message">{this.props.errorMessage}</div>
        ) : (
          undefined
        )}
      </React.Fragment>
    )
  }
}
