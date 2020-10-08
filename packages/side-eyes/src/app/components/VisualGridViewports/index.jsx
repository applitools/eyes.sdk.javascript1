import React from 'react'
import PropTypes from 'prop-types'
import Modal from '../../../commons/components/Modal'
import CustomViewportSize from '../VisualGridCustomViewportSize'
import VisualGridSelectedOptions from '../VisualGridSelectedOptions'
import AddButton from '../ActionButtons/AddButton'
import FlatButton from '../../../commons/components/FlatButton'
import CheckList from '../../../commons/components/CheckList'
import uuidv4 from 'uuid/v4'
import './style.css'

export default class VisualGridViewports extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    errorMessage: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    customOptions: PropTypes.array.isRequired,
    selectedOptions: PropTypes.array.isRequired,
    removeOption: PropTypes.func.isRequired,
    modalIsOpen: PropTypes.bool.isRequired,
    modalOpen: PropTypes.func.isRequired,
    modalClose: PropTypes.func.isRequired,
    modalStyles: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  render() {
    return (
      <React.Fragment>
        <div className="option-header">
          <div className="title">{this.props.name}</div>
          <AddButton onClick={this.props.modalOpen} isSelected={this.props.modalIsOpen} />
          <ViewportSelectionModal
            modalIsOpen={this.props.modalIsOpen}
            modalClose={this.props.modalClose}
            modalStyles={this.props.modalStyles}
            options={this.props.options}
            customOptions={this.props.customOptions}
            selectedOptions={this.props.selectedOptions}
            onSubmit={this.props.onSubmit}
          />
        </div>
        {this.props.selectedOptions.length ? (
          <VisualGridSelectedOptions items={this.props.selectedOptions} removeOption={this.props.removeOption} />
        ) : (
          <div className="error-message">{this.props.errorMessage}</div>
        )}
      </React.Fragment>
    )
  }
}

class ViewportSelectionModal extends React.Component {
  static propTypes = {
    modalStyles: PropTypes.object.isRequired,
    modalIsOpen: PropTypes.bool.isRequired,
    modalClose: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    customOptions: PropTypes.array.isRequired,
    selectedOptions: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      customViewportSizes: [...this.props.customOptions],
      selectedViewportSizes: [...this.props.selectedOptions],
    }
  }

  componentDidUpdate(prevProps) {
    // Refreshing the state since it is passed throught props and is altered
    // in the parent component. Also because when the user closes the window
    // we discard the state, but selections from the parent component need to
    // persist into this window.
    if (
      prevProps.selectedOptions !== this.props.selectedOptions ||
      (!prevProps.modalIsOpen && this.props.modalIsOpen) ||
      prevProps.customOptions !== this.props.customOptions
    )
      this.setState({
        selectedViewportSizes: [...this.props.selectedOptions],
        customViewportSizes: [...this.props.customOptions],
      })
  }

  addCustomViewportSize() {
    this.setState({
      ['customViewportSizes']: [
        ...this.state['customViewportSizes'],
        { id: uuidv4(), width: '', height: '', selected: false },
      ],
    })
  }

  close() {
    this.setState({
      selectedViewportSizes: [],
      customViewportSizes: [],
    })
    this.props.modalClose()
  }

  deleteCustomViewport(id) {
    this.setState({
      ['customViewportSizes']: this.state.customViewportSizes.filter(viewport => viewport.id !== id),
    })
    this.handleOptionChange(this.generateDimensions(this.state.customViewportSizes.find(size => size.id === id)), false)
  }

  findNumber(input) {
    const match = input.match(/\d/g)
    return match ? match.join('') : ''
  }

  generateDimensions(viewport, width, height) {
    if (viewport) return `${viewport.width}x${viewport.height}`
    else return `${width}x${height}`
  }

  handleOptionChange(dimensions, event) {
    const isEnabled = typeof event === 'boolean' ? event : event.target.checked
    if (isEnabled) {
      if (!this.isOptionSelected(dimensions)) {
        this.setState({
          ['selectedViewportSizes']: [...this.state.selectedViewportSizes, dimensions],
        })
      }
    } else {
      this.setState({
        ['selectedViewportSizes']: this.state.selectedViewportSizes.filter(option => option !== dimensions),
      })
    }
  }

  isOptionSelected(dimensions) {
    return !!this.state.selectedViewportSizes.filter(option => option === dimensions)[0]
  }

  onViewportChange(id, width = '', height = '', selected = false) {
    width = this.findNumber(width)
    height = this.findNumber(height)
    this.setState({
      ['customViewportSizes']: this.state.customViewportSizes.map(viewport =>
        viewport.id === id ? { id, width, height, selected } : viewport
      ),
    })
  }

  async syncSelectedViewportSizes() {
    if (!this.state.customViewportSizes.length) return
    this.state.customViewportSizes.forEach(viewportSize => {
      if (viewportSize.width.length && viewportSize.height.length) {
        this.handleOptionChange(
          this.generateDimensions(undefined, viewportSize.width, viewportSize.height),
          viewportSize.selected
        )
      }
    })
  }

  onViewportSubmit() {
    this.syncSelectedViewportSizes().then(() => {
      this.props.onSubmit(this.state.selectedViewportSizes, this.state.customViewportSizes)
      this.props.modalClose()
    })
  }

  render() {
    return (
      <Modal
        customStyles={this.props.modalStyles}
        modalIsOpen={this.props.modalIsOpen}
        onRequestClose={this.close.bind(this)}
      >
        <div className="predefined-viewport-sizes">
          <CheckList
            items={this.props.options}
            optionSelected={this.isOptionSelected.bind(this)}
            handleOptionChange={this.handleOptionChange.bind(this)}
          />
        </div>
        <hr />
        <div className="custom-viewport-sizes">
          <div className="header">
            <div className="title">Custom</div>
            <AddButton onClick={this.addCustomViewportSize.bind(this)} />
          </div>
          <div className="collection">
            {this.state.customViewportSizes.map(function(viewport) {
              return (
                <CustomViewportSize
                  key={viewport.id}
                  id={viewport.id}
                  width={viewport.width}
                  height={viewport.height}
                  selected={this.isOptionSelected(this.generateDimensions(viewport))}
                  onViewportChange={this.onViewportChange.bind(this)}
                  deleteOption={this.deleteCustomViewport.bind(this)}
                />
              )
            }, this)}
          </div>
        </div>
        <FlatButton className="confirm" type="submit" onClick={this.onViewportSubmit.bind(this)}>
          Confirm
        </FlatButton>
      </Modal>
    )
  }
}
