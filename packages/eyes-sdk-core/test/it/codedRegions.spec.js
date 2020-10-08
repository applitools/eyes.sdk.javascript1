const {expect} = require('chai')
const {startFakeEyesServer, getSession} = require('@applitools/sdk-fake-eyes-server')
const MockDriver = require('../utils/MockDriver')
const {EyesClassic, CheckSettings} = require('../utils/FakeSDK')

describe('codedRegions', async () => {
  let server, serverUrl, driver, eyes

  before(async () => {
    driver = new MockDriver()
    driver.mockElements([
      {selector: 'element0', rect: {x: 1, y: 2, width: 500, height: 501}},
      {selector: 'element1', rect: {x: 10, y: 11, width: 101, height: 102}},
      {selector: 'element2', rect: {x: 20, y: 21, width: 201, height: 202}},
      {selector: 'element3', rect: {x: 30, y: 31, width: 301, height: 302}},
      {selector: 'element4', rect: {x: 40, y: 41, width: 401, height: 402}},
    ])
    eyes = new EyesClassic()
    server = await startFakeEyesServer({logger: eyes._logger, matchMode: 'always'})
    serverUrl = `http://localhost:${server.port}`
    eyes.setServerUrl(serverUrl)
  })

  after(async () => {
    await server.close()
  })

  it('check window', async () => {
    await eyes.open(driver, 'FakeApp', 'FakeTest')
    const ignore = {left: 0, top: 1, width: 11, height: 12}
    const floating = await driver.findElement('element1')
    const accessibility = 'element2'
    const strict = {left: 90, top: 91, width: 91, height: 92}
    const content = await driver.findElement('element3')
    const layout = 'element4'
    await eyes.check(
      '',
      CheckSettings.window()
        .ignore(ignore)
        .floating(floating, 4, 3, 2, 1)
        .accessibility(accessibility)
        .strictRegion(strict)
        .contentRegion(content)
        .layoutRegion(layout),
    )
    const results = await eyes.close()
    const regions = await extractRegions(results)
    expect(regions.ignore).to.be.deep.equal([ignoreRegion(ignore)])
    expect(regions.floating).to.be.deep.equal([floatingRegion(floating.rect, 4, 3, 2, 1)])
    expect(regions.accessibility).to.be.deep.equal([
      accessibilityRegion(await driver.findElement(accessibility).then(element => element.rect)),
    ])
    expect(regions.strict).to.be.deep.equal([strictRegion(strict)])
    expect(regions.content).to.be.deep.equal([contentRegion(content.rect)])
    expect(regions.layout).to.be.deep.equal([
      layoutRegion(await driver.findElement(layout).then(element => element.rect)),
    ])
  })

  it('check region', async () => {
    await eyes.open(driver, 'FakeApp', 'FakeTest')
    const region = await driver.findElement('element0')
    const ignore = {left: 0, top: 1, width: 11, height: 12}
    const floating = await driver.findElement('element1')
    const accessibility = 'element2'
    const strict = {left: 90, top: 91, width: 91, height: 92}
    const content = await driver.findElement('element3')
    const layout = 'element4'
    await eyes.check(
      '',
      CheckSettings.region(region)
        .ignore(ignore)
        .floating(floating, 4, 3, 2, 1)
        .accessibility(accessibility)
        .strictRegion(strict)
        .contentRegion(content)
        .layoutRegion(layout),
    )
    const results = await eyes.close()
    const regions = await extractRegions(results)
    expect(regions.ignore).to.be.deep.equal([ignoreRegion(ignore)])
    expect(regions.floating).to.be.deep.equal([
      relatedRegion(floatingRegion(floating.rect, 4, 3, 2, 1), region.rect),
    ])
    expect(regions.accessibility).to.be.deep.equal([
      relatedRegion(
        accessibilityRegion(await driver.findElement(accessibility).then(element => element.rect)),
        region.rect,
      ),
    ])
    expect(regions.strict).to.be.deep.equal([strictRegion(strict)])
    expect(regions.content).to.be.deep.equal([
      relatedRegion(contentRegion(content.rect), region.rect),
    ])
    expect(regions.layout).to.be.deep.equal([
      relatedRegion(
        layoutRegion(await driver.findElement(layout).then(element => element.rect)),
        region.rect,
      ),
    ])
  })

  async function extractRegions(results) {
    const session = await getSession(results, serverUrl)
    const imageMatchSettings = session.steps[0].matchWindowData.options.imageMatchSettings
    return {
      ignore: imageMatchSettings.ignore.map(ignoreRegion),
      floating: imageMatchSettings.floating.map(floatingRegion),
      accessibility: imageMatchSettings.accessibility.map(accessibilityRegion),
      strict: imageMatchSettings.strict.map(strictRegion),
      content: imageMatchSettings.content.map(contentRegion),
      layout: imageMatchSettings.layout.map(layoutRegion),
    }
  }

  function ignoreRegion(region) {
    return {
      x: region.x || region.left,
      y: region.y || region.top,
      width: region.width,
      height: region.height,
    }
  }

  function floatingRegion(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset) {
    return {
      x: region.x || region.left,
      y: region.y || region.top,
      width: region.width,
      height: region.height,
      maxUpOffset: region.maxUpOffset || maxUpOffset,
      maxDownOffset: region.maxDownOffset || maxDownOffset,
      maxLeftOffset: region.maxLeftOffset || maxLeftOffset,
      maxRightOffset: region.maxRightOffset || maxRightOffset,
    }
  }

  function accessibilityRegion(region) {
    return {
      x: region.x || region.left,
      y: region.y || region.top,
      width: region.width,
      height: region.height,
    }
  }

  function strictRegion(region) {
    return {
      x: region.x || region.left,
      y: region.y || region.top,
      width: region.width,
      height: region.height,
    }
  }

  function contentRegion(region) {
    return {
      x: region.x || region.left,
      y: region.y || region.top,
      width: region.width,
      height: region.height,
    }
  }

  function layoutRegion(region) {
    return {
      x: region.x || region.left,
      y: region.y || region.top,
      width: region.width,
      height: region.height,
    }
  }

  function relatedRegion(region, parent) {
    return {
      ...region,
      x: region.x - parent.x,
      y: region.y - parent.y,
    }
  }
})
