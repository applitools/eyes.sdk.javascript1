import storage from '../../../IO/storage'
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import VisualGridOptionGroup from '../VisualGridOptionGroup'
import VisualGridOptionCategory from '../VisualGridOptionCategory'
import VisualGridViewports from '../VisualGridViewports'
import DownloadConfig from '../DownloadConfig'
import { browsers, experimentalBrowsers, viewportSizes, orientations, DeviceName } from './options'
import './style.css'

const ALL_BROWSERS = [...browsers, ...experimentalBrowsers]
export default class VisualGrid extends React.Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired,
    projectSettings: PropTypes.object.isRequired,
    isExperimental: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      modal: {
        browsers: false,
        viewports: false,
        devices: false,
        orientations: false,
      },
      projectSettings: { ...props.projectSettings },
      devices: Object.values(DeviceName),
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.projectSettings !== this.props.projectSettings)
      this.setState({ projectSettings: this.props.projectSettings })
  }

  // MODAL state management

  _setModal(type, value) {
    this.setState({ modal: { ...this.state.modal, [type]: value } })
  }

  modalOpen(type) {
    this._setModal(type, true)
  }

  modalClose(type) {
    this._setModal(type, false)
  }

  // REMOVE an option

  remove(key, value) {
    const result = this.state['projectSettings'][key].filter(option => option !== value)
    this.save({ [key]: result })
  }

  removeBrowser(value) {
    this.remove('selectedBrowsers', value)
  }

  removeSelectedViewport(value) {
    this.remove('selectedViewportSizes', value)
  }

  removeDevice(value) {
    this.remove('selectedDevices', value)
  }

  removeSelectedDeviceOrientation(value) {
    this.remove('selectedDeviceOrientations', value)
  }

  // SAVE options

  saveBrowsers(browsers) {
    this.save({ selectedBrowsers: browsers })
  }

  saveViewports(selectedViewports, customViewports) {
    this.save({
      selectedViewportSizes: selectedViewports,
      customViewportSizes: customViewports,
    })
  }

  saveDevices(devices) {
    this.save({ selectedDevices: devices })
  }

  saveDeviceOrientations(deviceOrientations) {
    this.save({ selectedDeviceOrientations: deviceOrientations })
  }

  save(result) {
    storage.get(['projectSettings']).then(({ projectSettings }) => {
      storage
        .set({
          ['projectSettings']: {
            ...projectSettings,
            [this.props.projectId]: {
              ...this.state.projectSettings,
              ...result,
            },
          },
        })
        .then(() => {
          this.setState({
            ['projectSettings']: {
              ...this.state.projectSettings,
              ...result,
            },
          })
        })
    })
  }
  render() {
    const hasOptionsSelected = !!(
      this.state.projectSettings.selectedDevices.length ||
      this.state.projectSettings.selectedDeviceOrientations.length ||
      this.state.projectSettings.selectedBrowsers.length ||
      this.state.projectSettings.selectedViewportSizes.length
    )
    const hasValidOptions =
      (this.state.projectSettings.selectedDevices.length &&
        this.state.projectSettings.selectedDeviceOrientations.length) ||
      (this.state.projectSettings.selectedBrowsers.length && this.state.projectSettings.selectedViewportSizes.length)
    return (
      <div className="visual-grid-options">
        {hasValidOptions ? <DownloadConfig projectSettings={this.state.projectSettings} /> : undefined}
        {!hasOptionsSelected ? (
          <div className={classNames('error-message', 'general-error')}>No options selected.</div>
        ) : (
          undefined
        )}
        <VisualGridOptionGroup
          name="Browsers"
          selectedCount={
            this.state.projectSettings.selectedBrowsers.length * this.state.projectSettings.selectedViewportSizes.length
          }
        >
          <div className="category browsers">
            <VisualGridOptionCategory
              name="Browsers"
              errorMessage={
                this.state.projectSettings.selectedDevices.length ||
                this.state.projectSettings.selectedDeviceOrientations.length ||
                !hasOptionsSelected
                  ? ''
                  : 'A browser is required.'
              }
              modalIsOpen={this.state.modal.browsers}
              modalOpen={this.modalOpen.bind(this, 'browsers')}
              modalClose={this.modalClose.bind(this, 'browsers')}
              modalStyles={{
                content: {
                  top: 'auto',
                  left: 'auto',
                  right: '-30%',
                  bottom: '11%',
                  width: '170px',
                  transform: 'translate(-50%, -50%)',
                },
              }}
              options={this.props.isExperimental ? ALL_BROWSERS : browsers}
              selectedOptions={this.state.projectSettings.selectedBrowsers}
              removeOption={this.removeBrowser.bind(this)}
              onSubmit={this.saveBrowsers.bind(this)}
            />
          </div>
          <div className="category viewports">
            <VisualGridViewports
              name="Viewport Sizes"
              errorMessage={this.state.projectSettings.selectedBrowsers.length ? 'A viewport size is required.' : ''}
              modalIsOpen={this.state.modal.viewports}
              modalOpen={this.modalOpen.bind(this, 'viewports')}
              modalClose={this.modalClose.bind(this, 'viewports')}
              modalStyles={{
                content: {
                  top: '325px',
                  left: 'auto',
                  right: '-90px',
                  bottom: 'auto',
                  width: '175px',
                  maxHeight: '370px',
                  transform: 'translate(-50%, -50%)',
                },
              }}
              options={viewportSizes}
              customOptions={this.state.projectSettings.customViewportSizes}
              selectedOptions={this.state.projectSettings.selectedViewportSizes}
              removeOption={this.removeSelectedViewport.bind(this)}
              onSubmit={this.saveViewports.bind(this)}
            />
          </div>
        </VisualGridOptionGroup>
        <hr className="group-divider" />
        <VisualGridOptionGroup
          name="Devices"
          selectedCount={
            this.state.projectSettings.selectedDevices.length *
            this.state.projectSettings.selectedDeviceOrientations.length
          }
        >
          <div className="category devices">
            <VisualGridOptionCategory
              name="Devices"
              errorMessage={this.state.projectSettings.selectedDeviceOrientations.length ? 'A device is required.' : ''}
              modalIsOpen={this.state.modal.devices}
              modalOpen={this.modalOpen.bind(this, 'devices')}
              modalClose={this.modalClose.bind(this, 'devices')}
              modalStyles={{
                content: {
                  top: 'auto',
                  left: 'auto',
                  right: '-30%',
                  bottom: '-11%',
                  overflow: 'hidden',
                  width: '170px',
                  height: '351px',
                  transform: 'translate(-50%, -50%)',
                },
              }}
              options={this.state.devices}
              selectedOptions={this.state.projectSettings.selectedDevices}
              removeOption={this.removeDevice.bind(this)}
              onSubmit={this.saveDevices.bind(this)}
              isSearch={true}
            />
          </div>
          <div className="category device-orientations">
            <VisualGridOptionCategory
              name="Orientations"
              errorMessage={
                this.state.projectSettings.selectedDevices.length ? 'A device orientation is required.' : ''
              }
              modalIsOpen={this.state.modal.orientations}
              modalOpen={this.modalOpen.bind(this, 'orientations')}
              modalClose={this.modalClose.bind(this, 'orientations')}
              modalStyles={{
                content: {
                  top: 'auto',
                  left: 'auto',
                  right: '-30%',
                  bottom: '6%',
                  width: '170px',
                  transform: 'translate(-50%, -50%)',
                },
              }}
              options={orientations}
              selectedOptions={this.state.projectSettings.selectedDeviceOrientations}
              removeOption={this.removeSelectedDeviceOrientation.bind(this)}
              onSubmit={this.saveDeviceOrientations.bind(this)}
            />
          </div>
        </VisualGridOptionGroup>
      </div>
    )
  }
}
