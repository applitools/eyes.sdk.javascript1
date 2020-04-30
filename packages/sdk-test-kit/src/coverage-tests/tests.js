const assert = require('assert')

const supportedCommands = [
  'abort',
  'checkFrame',
  'checkRegion',
  'checkWindow',
  'close',
  'open',
  'scrollDown',
  'switchToFrame',
  'getAllTestResults',
  'type',
  'visit',
]

function makeCoverageTests({
  abort,
  checkFrame,
  checkRegion,
  checkWindow,
  close,
  open,
  scrollDown,
  switchToFrame,
  getAllTestResults,
  type,
  visit,
} = {}) {
  const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'
  const viewportSize = '700x460'
  const throwException = true

  async function sleep(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout))
  }

  return {
    'Test Abort': async () => {
      await visit('data:text/html,<p>Test</p>')
      await open({appName: 'Test Abort', viewportSize: '1200x800'})
      await checkWindow()
      await sleep(15000)
      await abort()
    },
    TestAcmeLogin: async () => {
      await visit('https://afternoon-savannah-68940.herokuapp.com/#')
      await open({appName: 'Eyes Selenium SDK - ACME', viewportSize: '1024x768'})
      await type('#username', 'adamC')
      await type('#password', 'MySecret123?')
      await checkRegion('#username')
      await checkRegion('#password')
      await close(throwException)
    },
    TestCheckElementFully_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion('#overflowing-div-image', {isFully: true})
      await close(throwException)
    },
    TestCheckElementWithIgnoreRegionByElementOutsideTheViewport_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion('#overflowing-div-image', {ignoreRegion: '#overflowing-div'})
      await close(throwException)
    },
    TestCheckElementWithIgnoreRegionBySameElement_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion('#overflowing-div-image', {ignoreRegion: '#overflowing-div-image'})
      await close(throwException)
    },
    TestCheckFrame: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkFrame('[name="frame1"]', {isClassicApi: true})
      await close(throwException)
    },
    TestCheckFrame_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkFrame('[name="frame1"]')
      await close(throwException)
    },
    TestCheckFrameHideScrollbars_Fluent: async () => {
      // This test is identical to TestCheckFrame_Fluent, and exists only in order to have a new baseline. Once all SDK's implement this test properly, we can remove it and update the baseline for TestCheckFrame_Fluent
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkFrame('[name="frame1"]')
      await close(throwException)
    },
    TestCheckFrameFully_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkFrame('[name="frame1"]', {isFully: true})
      await close(throwException)
    },
    TestCheckFrameInFrame_Fully_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkFrame(['[name="frame1"]', '[name="frame1-1"]'], {isFully: true})
      await close(throwException)
    },
    TestCheckFrameInFrame_Fully_Fluent2: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkWindow({isFully: true})
      await checkFrame(['[name="frame1"]', '[name="frame1-1"]'], {isFully: true})
      await close(throwException)
    },
    TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkWindow({isFully: true, ignoreRegion: '.ignore'})
      await close(throwException)
    },
    TestCheckOverflowingRegionByCoordinates_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion({left: 50, top: 110, width: 90, height: 550})
      await close(throwException)
    },
    TestCheckPageWithHeader_Window: async () => {
      await visit('https://applitools.github.io/demo/TestPages/PageWithHeader/index.html')
      await open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
      await checkWindow({isClassicApi: false, isFully: false})
      await close(throwException)
    },
    TestCheckPageWithHeader_Window_Fully: async () => {
      await visit('https://applitools.github.io/demo/TestPages/PageWithHeader/index.html')
      await open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
      await checkWindow({isClassicApi: false, isFully: true})
      await close(throwException)
    },
    TestCheckPageWithHeader_Region: async () => {
      await visit('https://applitools.github.io/demo/TestPages/PageWithHeader/index.html')
      await open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
      await checkRegion('div.page', {isClassicApi: false, isFully: false})
      await close(throwException)
    },
    TestCheckPageWithHeaderFully_Region: async () => {
      await visit('https://applitools.github.io/demo/TestPages/PageWithHeader/index.html')
      await open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
      await checkRegion('div.page', {isClassicApi: false, isFully: true})
      await close(throwException)
    },
    TestCheckRegion: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkRegion('#overflowing-div', {isClassicApi: true, isFully: true})
      await close(throwException)
    },
    TestCheckRegion2: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkRegion('#overflowing-div-image', {isClassicApi: true, isFully: true})
      await close(throwException)
    },
    TestCheckRegionInAVeryBigFrame: async () => {
      await visit('https://applitools.github.io/demo/TestPages/WixLikeTestPage/index.html')
      await open({appName: 'Eyes Selenium SDK - Special Cases', viewportSize})
      await checkRegion('img', {inFrame: '[name="frame1"]'})
      await close(throwException)
    },
    TestCheckRegionInAVeryBigFrameAfterManualSwitchToFrame: async () => {
      await visit('https://applitools.github.io/demo/TestPages/WixLikeTestPage/index.html')
      await open({appName: 'Eyes Selenium SDK - Special Cases', viewportSize})
      await switchToFrame('[name="frame1"]')
      await checkRegion('img')
      await close(throwException)
    },
    TestCheckRegionByCoordinates_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion({left: 50, top: 70, width: 90, height: 110})
      await close(throwException)
    },
    TestCheckRegionByCoordinateInFrame_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion({left: 30, top: 40, width: 400, height: 1200}, {inFrame: '[name="frame1"]'})
      await close(throwException)
    },
    TestCheckRegionByCoordinateInFrameFully_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion(
        {left: 30, top: 40, width: 400, height: 1200},
        {inFrame: '[name="frame1"]', isFully: true},
      )
      await close(throwException)
    },
    TestCheckRegionBySelectorAfterManualScroll_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await scrollDown(250)
      await checkRegion('#centered')
      await close(throwException)
    },
    TestCheckRegionInFrame: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkRegion('#inner-frame-div', {
        inFrame: '[name="frame1"]',
        isClassicApi: true,
        isFully: true,
      })
      await close(throwException)
    },
    TestCheckRegionInFrame_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion('#inner-frame-div', {
        inFrame: '[name="frame1"]',
        isFully: true,
      })
      await close(throwException)
    },
    TestCheckRegionInFrame3_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkFrame('[name="frame1"]', {
        isFully: true,
        isLayout: true,
        floatingRegion: {
          target: {left: 25, top: 25, width: 25, height: 25},
          maxUp: 200,
          maxDown: 200,
          maxLeft: 150,
          maxRight: 150,
        },
      })
      await close(throwException)
    },
    TestCheckRegionWithIgnoreRegion_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion('#overflowing-div', {
        ignoreRegion: {left: 50, top: 50, width: 100, height: 100},
      })
      await close(throwException)
    },
    //TestCheckScrollableModal: async () => {
    //  await visit(url)
    //  await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    //  await click('#centered')
    //  await checkRegion('#modal-content', {scrollRootElement: '#modal1', isFully: true})
    //  await close(throwException)
    //},
    TestCheckWindow: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkWindow({isClassicApi: true})
      await close(throwException)
    },
    TestCheckWindow_Body: async () => {
      await visit('https://applitools.github.io/demo/TestPages/SimpleTestPage/scrollablebody.html')
      await open({appName: 'Eyes Selenium SDK - Scroll Root Element', viewportSize})
      await checkWindow({scrollRootElement: 'body', isFully: true})
      await close(throwException)
    },
    TestCheckWindow_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkWindow()
      await close(throwException)
    },
    TestCheckWindow_Html: async () => {
      await visit('https://applitools.github.io/demo/TestPages/SimpleTestPage/scrollablebody.html')
      await open({appName: 'Eyes Selenium SDK - Scroll Root Element', viewportSize})
      await checkWindow({scrollRootElement: 'html', isFully: true})
      await close(throwException)
    },
    TestCheckWindow_Simple_Html: async () => {
      await visit('https://applitools.github.io/demo/TestPages/SimpleTestPage/index.html')
      await open({appName: 'Eyes Selenium SDK - Scroll Root Element', viewportSize})
      await checkWindow({scrollRootElement: 'html', isFully: true})
      await close(throwException)
    },
    TestCheckWindowAfterScroll: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await scrollDown(350)
      await checkWindow({isClassicApi: true})
      await close(throwException)
    },
    TestCheckWindowFully: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkWindow({isClassicApi: true, isFully: true})
      await close(throwException)
    },
    TestCheckWindowViewport: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkWindow({isClassicApi: true, isFully: false})
      await close(throwException)
    },
    TestCheckWindowWithFloatingByRegion_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkWindow({
        floatingRegion: {
          target: {left: 10, top: 10, width: 20, height: 10},
          maxUp: 3,
          maxDown: 3,
          maxLeft: 20,
          maxRight: 30,
        },
      })
      await close(throwException)
    },
    TestCheckWindowWithFloatingBySelector_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkWindow({
        floatingRegion: {
          target: '#overflowing-div',
          maxUp: 3,
          maxDown: 3,
          maxLeft: 20,
          maxRight: 30,
        },
      })
      await close(throwException)
    },
    TestCheckWindowWithIgnoreBySelector_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkWindow({ignoreRegion: '#overflowing-div'})
      await close(throwException)
    },
    TestCheckWindowWithIgnoreBySelector_Centered_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkWindow({ignoreRegion: '#centered'})
      await close(throwException)
    },
    TestCheckWindowWithIgnoreBySelector_Stretched_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkWindow({ignoreRegion: '#stretched'})
      await close(throwException)
    },
    TestCheckWindowWithIgnoreRegion_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await type('input', 'My Input')
      await checkWindow({
        isFully: true,
        ignoreRegion: {left: 50, top: 50, width: 100, height: 100},
      })
      await close(throwException)
    },
    TestDoubleCheckWindow: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      await checkWindow({isClassicApi: true, tag: 'first'})
      await checkWindow({isClassicApi: true, tag: 'second'})
      await close(throwException)
    },
    TestSimpleRegion: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkRegion({left: 50, top: 50, width: 100, height: 100})
      await close(throwException)
    },
    TestScrollbarsHiddenAndReturned_Fluent: async () => {
      await visit(url)
      await open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      await checkWindow({isFully: true})
      await checkRegion('#inner-frame-div', {isFully: true})
      await checkWindow({isFully: true})
      await close(throwException)
    },
    Test_VGTestsCount_1: async () => {
      await visit('https://applitools.com/helloworld')
      await open({appName: 'Test Count', viewportSize: '640x480'})
      await checkWindow({isFully: true})
      await close(false) // VisualGridRunner::getAllResults doesn't call Eyes::close. In non-JS SDK's it does, but that should be deprecated. Users should be instructed to call close explicitly.
      assert.deepStrictEqual((await getAllTestResults(throwException)).length, 1)
    },
  }
}

module.exports = {
  supportedCommands,
  makeCoverageTests,
}
