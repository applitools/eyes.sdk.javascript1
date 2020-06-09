import { cleanup, render, waitForElement } from '@testing-library/react'
import { click, findElement, innerHtml, mouseOver, sendKeys } from '../../../../../tests/utils'
import React from 'react'
import Normal from '../../../containers/Normal'
import uuidv4 from 'uuid/v4'
jest.mock('../../../../IO/storage')
import { waitForCompletion } from '../../../../IO/storage'
import { updateBrowserNamesForBackwardsCompatibility } from '../../../components/VisualGrid/options'

describe('Visual grid options utils', () => {
  it('supports browsername backwards compatibility', () => {
    const browsers = ['Chrome', 'Edge', 'Firefox']
    expect(updateBrowserNamesForBackwardsCompatibility(browsers)).toEqual(['Chrome', 'Edge Legacy', 'Firefox'])
  })
})

describe('Visual grid options UI', () => {
  beforeEach(async () => {
    doRender()
    await waitForElement(() => findElement('#enable-visual-grid'))
    click('#enable-visual-grid')
  })
  afterEach(cleanup)

  // user flow

  it('disabling visual grid options hides them', async () => {
    click('#enable-visual-grid')
    await waitForElement(() => !findElement('.disclaimer'))
    expect(findElement('.disclaimer')).toBeNull()
  })

  it('terms of service presented', () => {
    expect(innerHtml('.disclaimer')).toBeTruthy()
    click('.disclaimer button')
    expect(innerHtml('.disclaimer')).toBeFalsy()
  })

  it('browser is populated with a sensible default', () => {
    acceptEula()
    toggleBrowsersGroup()
    expect(innerHtml('.category.browsers .selected-options .option-text')).toBeTruthy()
  })

  it('viewport size is populated with a sensible default', () => {
    acceptEula()
    toggleBrowsersGroup()
    expect(innerHtml('.category.viewports .selected-options .option-text')).toBeTruthy()
  })

  it('error displayed when browser selected but no viewport size selected', async () => {
    acceptEula()
    toggleBrowsersGroup()
    click('.category.viewports .selected-options .close.outer')
    await waitForCompletion()
    expect(innerHtml('.category.viewports .error-message')).toBeTruthy()
    expect(innerHtml('.general-error')).toBeFalsy()
  })

  it('error displayed when device selected but no device orientation selected', async () => {
    acceptEula()
    toggleDevicesGroup()
    await toggleSelectedDevice()
    await waitForCompletion()
    expect(innerHtml('.category.device-orientations .error-message')).toBeTruthy()
    expect(innerHtml('.general-error')).toBeFalsy()
  })

  it('should be able to leave browser and viewport empty if valid device options specified', async () => {
    acceptEula()
    toggleDevicesGroup()
    toggleSelectedDevice()
    toggleSelectedDeviceOrientation()
    toggleBrowsersGroup()
    removeSelectedBrowser()
    removeSelectedViewport()
    await waitForCompletion()
    expect(innerHtml('.category.browsers .error-message')).toBeFalsy()
    expect(innerHtml('.category.viewports .error-message')).toBeFalsy()
    expect(innerHtml('.general-error')).toBeFalsy()
  })

  it('should be able to leave device and orientation empty if valid browser options specified', async () => {
    acceptEula()
    toggleDevicesGroup()
    await waitForCompletion()
    expect(innerHtml('.category.browsers .error-message')).toBeFalsy()
    expect(innerHtml('.category.viewports .error-message')).toBeFalsy()
    expect(innerHtml('.general-error')).toBeFalsy()
  })

  it('should display top level error message when no valid options provided', async () => {
    acceptEula()
    toggleBrowsersGroup()
    removeSelectedBrowser()
    removeSelectedViewport()
    await waitForCompletion()
    expect(innerHtml('.category.browsers .error-message')).toBeFalsy()
    expect(innerHtml('.category.viewports .error-message')).toBeFalsy()
    expect(innerHtml('.category.devices .error-message')).toBeFalsy()
    expect(innerHtml('.category.device-orientations .error-message')).toBeFalsy()
    expect(innerHtml('.general-error')).toBeTruthy()
  })

  // browsers

  it('select/deselect a browser', async () => {
    let storage
    acceptEula()
    toggleBrowsersGroup()
    click('.category.browsers .selected-options .close.inner')
    storage = await waitForCompletion()
    expect(storage.projectSettings[projectId].selectedBrowsers.length).toBeFalsy()
    storage = await toggleSelectedBrowser()
    expect(storage.projectSettings[projectId].selectedBrowsers.length).toBeTruthy()
    storage = await toggleSelectedBrowser()
    expect(storage.projectSettings[projectId].selectedBrowsers.length).toBeFalsy()
  })

  // viewports

  it('deselect a predefined viewport size from the main menu', async () => {
    acceptEula()
    toggleBrowsersGroup()
    click('.category.viewports .selected-options .close.inner')
    const storage = await waitForCompletion()
    expect(storage.projectSettings[projectId].selectedViewportSizes.length).toBeFalsy()
  })

  it('select a predefined viewport size', async () => {
    acceptEula()
    toggleBrowsersGroup()
    click('.category.viewports .selected-options .close.inner')
    await waitForCompletion()
    const selectedSize = togglePredefinedViewportSize()
    const storage = await waitForCompletion()
    expect(storage.projectSettings[projectId].selectedViewportSizes.includes(selectedSize)).toBeTruthy()
  })

  it('deselect a predefined viewport size', async () => {
    acceptEula()
    toggleBrowsersGroup()
    click('.category.viewports .add.inner')
    click('.predefined-viewport-sizes input[type=checkbox]:checked')
    click('.btn.confirm')
    const storage = await waitForCompletion()
    expect(storage.projectSettings[projectId].selectedViewportSizes.length).toBeFalsy()
  })

  it('create and select a custom viewport', async () => {
    await acceptEula()
    toggleBrowsersGroup()
    click('.category.viewports .selected-options .close.inner')
    await waitForCompletion()
    await addCustomViewport(100, 100)
    click('.btn.confirm')
    const storage = await waitForCompletion()
    expect(storage.projectSettings[projectId].selectedViewportSizes.includes('100x100')).toBeTruthy()
    expect(storage.projectSettings[projectId].selectedViewportSizes.length).toEqual(1)
  })

  it('create and delete a custom viewport', async () => {
    await acceptEula()
    toggleBrowsersGroup()
    await addCustomViewport(100, 100)
    mouseOver('.custom-viewport-size')
    click('.custom-viewport-size .close.inner')
    click('.btn.confirm')
    const storage = await waitForCompletion()
    expect(storage.projectSettings[projectId].selectedViewportSizes.includes('100x100')).toBeFalsy()
  })

  it('negative numbers ignored when creating a custom viewport', async () => {
    await acceptEula()
    toggleBrowsersGroup()
    await addCustomViewport(-100, -100)
    click('.btn.confirm')
    const storage = await waitForCompletion()
    expect(storage.projectSettings[projectId].selectedViewportSizes.includes('100x100')).toBeTruthy()
  })

  it('inputting both width and height for a custom viewport enables it', async () => {
    await acceptEula()
    toggleBrowsersGroup()
    await addCustomViewport(100, 100)
    expect(findElement('.custom-viewport-size .checkbox').checked).toBeTruthy()
  })

  it('remove width or height for a custom viewport disables it', async () => {
    await acceptEula()
    toggleBrowsersGroup()
    await addCustomViewport(100, 100)
    sendKeys('.custom-viewport-size .width', '')
    expect(findElement('.custom-viewport-size .checkbox').checked).toBeFalsy()
    sendKeys('.custom-viewport-size .width', 100)
    expect(findElement('.custom-viewport-size .checkbox').checked).toBeTruthy()
    sendKeys('.custom-viewport-size .height', '')
    expect(findElement('.custom-viewport-size .checkbox').checked).toBeFalsy()
    sendKeys('.custom-viewport-size .height', 100)
    expect(findElement('.custom-viewport-size .checkbox').checked).toBeTruthy()
  })

  it('committing an auto-enabled custom viewport saves it', async () => {
    await acceptEula()
    toggleBrowsersGroup()
    await addCustomViewport(1, 1)
    click('.btn.confirm')
    const storage = await waitForCompletion()
    expect(storage.projectSettings[projectId].selectedViewportSizes.includes('1x1')).toBeTruthy()
  })

  // device orientations

  it('remove a selected device orientation', async () => {
    let storage
    acceptEula()
    toggleDevicesGroup()
    await toggleSelectedDevice()

    toggleSelectedDeviceOrientation()
    storage = await waitForCompletion()
    expect(storage.projectSettings[projectId].selectedDeviceOrientations.length).toBeTruthy()

    toggleSelectedDeviceOrientation()
    storage = await waitForCompletion()
    expect(storage.projectSettings[projectId].selectedDeviceOrientations.length).toBeFalsy()
  })
})

// helper functions

const projectId = uuidv4()

function doRender() {
  const { container } = render(
    <Normal enableVisualCheckpoints={true} visualCheckpointsChanged={() => {}} projectId={projectId} />
  )
  return container
}

async function toggleBrowsersGroup() {
  click('.group-header')
}

function toggleDevicesGroup() {
  click('.group-header.devices')
}

async function toggleSelectedBrowser() {
  click('.category.browsers .add.inner')
  click('.selections .checkbox')
  click('.btn.confirm')
  return await waitForCompletion()
}

async function toggleSelectedDevice() {
  click('.category.devices .add.inner')
  click('.selections .checkbox')
  click('.btn.confirm')
  await waitForCompletion()
}

async function toggleSelectedDeviceOrientation() {
  click('.category.device-orientations .add.inner')
  click('.selections .checkbox')
  click('.btn.confirm')
  await waitForCompletion()
}

function togglePredefinedViewportSize() {
  click('.category.viewports .add.inner')
  const selectedSize = innerHtml('.predefined-viewport-sizes label div')
  click('.predefined-viewport-sizes .checkbox')
  click('.btn.confirm')
  return selectedSize
}

async function addCustomViewport(width, height) {
  click('.category.viewports .add.inner')
  click('.custom-viewport-sizes .add.inner')
  await waitForElement(() => findElement('.custom-viewport-size'))
  sendKeys('.custom-viewport-size .width', width)
  sendKeys('.custom-viewport-size .height', height)
}

async function acceptEula() {
  click('.disclaimer button')
  await waitForElement(() => !findElement('.disclaimer'))
}

function removeSelectedBrowser() {
  click('.category.browsers .close.inner')
}

function removeSelectedViewport() {
  click('.category.viewports .close.inner')
}
