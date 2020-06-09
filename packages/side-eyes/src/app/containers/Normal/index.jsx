import browser from 'webextension-polyfill'
import storage from '../../../IO/storage'
import React from 'react'
import PropTypes from 'prop-types'
import Checkbox from '../../../commons/components/Checkbox'
import Combobox from '../../../commons/components/Combobox'
import Input from '../../../commons/components/Input'
import MoreInfo from '../../components/MoreInfo'
import Link from '../../../commons/components/Link'
import { DEFAULT_SERVER } from '../../../commons/api.js'
import VisualGrid from '../../components/VisualGrid'
import VisualGridEula from '../../components/VisualGridEula'
import { isExperimentalBrowser } from '../../../background/utils/parsers'
import './style.css'
import { updateBrowserNamesForBackwardsCompatibility } from '../../components/VisualGrid/options'

export default class Normal extends React.Component {
  static propTypes = {
    enableVisualCheckpoints: PropTypes.bool.isRequired,
    visualCheckpointsChanged: PropTypes.func.isRequired,
    projectId: PropTypes.string.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      eyesServer: '',
      enableVisualGrid: true,
    }
    this.setProjectSettings()
    this.setProjectSettings = this.setProjectSettings.bind(this)
    this.signEula = this.signEula.bind(this)
  }
  componentDidUpdate(prevProps) {
    if (prevProps.projectId !== this.props.projectId) {
      this.setProjectSettings()
    }
  }
  openOptionsPage() {
    browser.runtime.openOptionsPage()
  }
  handleCheckboxChange(name, e) {
    if (name) {
      const { checked } = e.target
      this.setProjectSettings().then(() => this.handleInputChange(name, checked))
    } else {
      this.props.visualCheckpointsChanged(e.target.checked)
    }
  }
  handleInputChange(name, value) {
    // used for branches and visual grid checkbox
    const result = { ...this.state.projectSettings, [name]: value }
    storage.get(['projectSettings']).then(({ projectSettings }) => {
      storage
        .set({
          ['projectSettings']: {
            ...projectSettings,
            [this.props.projectId]: result,
          },
        })
        .then(() => {
          this.setState({ projectSettings: result })
        })
    })
  }
  setProjectSettings() {
    return storage
      .get(['eyesServer', 'eulaSignDate', 'isFree', 'projectSettings', 'experimentalEnabled', 'accountInfo'])
      .then(({ eyesServer, eulaSignDate, isFree, projectSettings, experimentalEnabled, accountInfo }) => {
        const settings =
          projectSettings && projectSettings[this.props.projectId]
            ? projectSettings[this.props.projectId]
            : {
                branch: '',
                parentBranch: '',
                enableVisualGrid: false,
                enableContrastAdvisor: false,
                enablePatternsDom: false,
                selectedBrowsers: ['Chrome'],
                selectedViewportSizes: ['1920x1080'],
                customViewportSizes: [],
                selectedDevices: [],
                selectedDeviceOrientations: [],
                enableAccessibilityValidations: false,
                accessibilityLevel: 'AA',
                accessibilityVersion: '2.0',
                accountInfo: {},
              }
        if (!experimentalEnabled && projectSettings && projectSettings[this.props.projectId]) {
          settings.selectedBrowsers = settings.selectedBrowsers.filter(b => !isExperimentalBrowser(b.toLowerCase()))
          storage.set({
            ['projectSettings']: {
              ...projectSettings,
              [this.props.projectId]: {
                ...settings,
              },
            },
          })
        }
        if (projectSettings && projectSettings[this.props.projectId]) {
          settings.selectedBrowsers = updateBrowserNamesForBackwardsCompatibility(settings.selectedBrowsers)
          storage.set({
            ['projectSettings']: {
              ...projectSettings,
              [this.props.projectId]: {
                ...settings,
              },
            },
          })
        }
        this.setState({
          eyesServer,
          eulaSigned: !!eulaSignDate,
          isFree,
          projectSettings: settings,
          isExperimental: experimentalEnabled,
          accountInfo,
        })
      })
  }
  signEula() {
    this.setState({ eulaSigned: true })
    storage
      .set({
        eulaSignDate: new Date().toISOString(),
      })
      .then(() => {
        this.setState({ eulaSigned: true })
      })
  }
  render() {
    return (
      <div className="project-settings">
        <Checkbox
          id="enable-checks"
          className="checkbox"
          name="enable-checks"
          label="Enable visual checkpoints"
          checked={this.props.enableVisualCheckpoints}
          onChange={this.handleCheckboxChange.bind(this, undefined)}
        />
        {this.state.projectSettings && (
          <React.Fragment>
            <hr />
            <h4>Project settings</h4>
            <Input
              name="branch"
              label="Branch name"
              value={this.state.projectSettings.branch}
              onChange={this.handleInputChange.bind(this, 'branch')}
            />
            <Input
              name="parentBranch"
              label="Parent branch name"
              value={this.state.projectSettings.parentBranch}
              onChange={this.handleInputChange.bind(this, 'parentBranch')}
            />
            <Checkbox
              id="enable-visual-grid"
              className="checkbox"
              name="enable-visual-grid"
              label="Execute using Ultrafast Grid"
              checked={this.state.projectSettings.enableVisualGrid}
              onChange={this.handleCheckboxChange.bind(this, 'enableVisualGrid')}
            />
            {this.state.projectSettings.enableVisualGrid && !this.state.eulaSigned && !this.state.isFree && (
              <VisualGridEula onEulaSigned={this.signEula} />
            )}
            {this.state.projectSettings.enableVisualGrid && (this.state.eulaSigned || this.state.isFree) && (
              <VisualGrid
                projectId={this.props.projectId}
                projectSettings={this.state.projectSettings}
                isExperimental={this.state.isExperimental}
              />
            )}
            {this.state.accountInfo &&
              this.state.accountInfo.features &&
              this.state.accountInfo.features.includes('accessibility') && (
                <React.Fragment>
                  <Checkbox
                    id="enable-accessibility-validations"
                    label="Enable Contrast Advisor"
                    checked={this.state.projectSettings.enableAccessibilityValidations}
                    onChange={this.handleCheckboxChange.bind(this, 'enableAccessibilityValidations')}
                  />
                  {this.state.projectSettings.enableAccessibilityValidations && (
                    <div id="accessibility-options">
                      <Combobox
                        className="accessibility-option"
                        label="WCAG Version"
                        items={['2.0', '2.1']}
                        selectedItem={this.state.projectSettings.accessibilityVersion}
                        disabled={!this.state.projectSettings.enableAccessibilityValidations}
                        onChange={this.handleInputChange.bind(this, 'accessibilityVersion')}
                      />
                      <Combobox
                        className="accessibility-option"
                        label="Conformance Level"
                        items={['AA', 'AAA']}
                        selectedItem={this.state.projectSettings.accessibilityLevel}
                        disabled={!this.state.projectSettings.enableAccessibilityValidations}
                        onChange={this.handleInputChange.bind(this, 'accessibilityLevel')}
                      />
                    </div>
                  )}
                </React.Fragment>
              )}
            {this.state.isExperimental && (
              <React.Fragment>
                <Checkbox
                  id="enable-patterns-dom"
                  label="Enable advanced pattern matching"
                  checked={this.state.projectSettings.enablePatternsDom}
                  onChange={this.handleCheckboxChange.bind(this, 'enablePatternsDom')}
                />
              </React.Fragment>
            )}
          </React.Fragment>
        )}
        <hr />
        <div className="open-global-settings">
          <a href="#" onClick={this.openOptionsPage}>
            Open global settings
          </a>
          <Link
            href={new URL('/app/test-results/', this.state.eyesServer || DEFAULT_SERVER).href}
            style={{
              display: 'block',
              lineHeight: '17px',
            }}
          >
            Open test manager
          </Link>
        </div>
        <footer>
          <p className="more-options">
            More options will be available when running or recording tests. <MoreInfo />
          </p>
        </footer>
      </div>
    )
  }
}
