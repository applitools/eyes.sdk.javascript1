//const assert = require('assert')

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

  function sleep(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout))
  }

  return {
    'Test Abort': () => {
      visit('data:text/html,<p>Test</p>')
      checkWindow()
      //sleep(15000)
      abort()
    },
    TestAcmeLogin: () => {
      visit('https://afternoon-savannah-68940.herokuapp.com/#')
      open({appName: 'Eyes Selenium SDK - ACME', viewportSize: '1024x768'})
      type('#username', 'adamC')
      type('#password', 'MySecret123?')
      checkRegion('#username')
      checkRegion('#password')
      close(throwException)
    },
    TestCheckElementFully_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkRegion('[name="frame1"]', {isFully: true})
      close(throwException)
    },
    TestCheckElementWithIgnoreRegionByElementOutsideTheViewport_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkRegion('#overflowing-div-image', {ignoreRegion: '#overflowing-div'})
      close(throwException)
    },
    TestCheckElementWithIgnoreRegionBySameElement_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkRegion('#overflowing-div-image', {ignoreRegion: '#overflowing-div-image'})
      close(throwException)
    },
    TestCheckFrame: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      checkFrame('[name="frame1"]', {isClassicApi: true})
      close(throwException)
    },
    TestCheckFrame_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkFrame('[name="frame1"]')
      close(throwException)
    },
    TestCheckFrameFully_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkFrame('[name="frame1"]', {isFully: true})
      close(throwException)
    },
    TestCheckFrameInFrame_Fully_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkFrame(['[name="frame1"]', '[name="frame1-1"]'], {isFully: true})
      close(throwException)
    },
    TestCheckFrameInFrame_Fully_Fluent2: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkWindow({isFully: true})
      checkFrame(['[name="frame1"]', '[name="frame1-1"]'], {isFully: true})
      close(throwException)
    },
    TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkWindow({isFully: true, ignoreRegion: '.ignore'})
      close(throwException)
    },
    TestCheckOverflowingRegionByCoordinates_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkRegion({left: 50, top: 110, width: 90, height: 550})
      close(throwException)
    },
    TestCheckPageWithHeader_Window: () => {
      visit('https://applitools.github.io/demo/TestPages/PageWithHeader/index.html')
      open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
      checkWindow({isClassicApi: false, isFully: false})
      close(throwException)
    },
    TestCheckPageWithHeader_Window_Fully: () => {
      visit('https://applitools.github.io/demo/TestPages/PageWithHeader/index.html')
      open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
      checkWindow({isClassicApi: false, isFully: true})
      close(throwException)
    },
    TestCheckPageWithHeader_Region: () => {
      visit('https://applitools.github.io/demo/TestPages/PageWithHeader/index.html')
      open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
      checkRegion('div.page', {isClassicApi: false, isFully: false})
      close(throwException)
    },
    TestCheckPageWithHeaderFully_Region: () => {
      visit('https://applitools.github.io/demo/TestPages/PageWithHeader/index.html')
      open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
      checkRegion('div.page', {isClassicApi: false, isFully: true})
      close(throwException)
    },
    TestCheckRegion: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      checkRegion('#overflowing-div', {isClassicApi: true, isFully: true})
      close(throwException)
    },
    TestCheckRegion2: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      checkRegion('#overflowing-div-image', {isClassicApi: true, isFully: true})
      close(throwException)
    },
    TestCheckRegionInAVeryBigFrame: () => {
      visit('https://applitools.github.io/demo/TestPages/WixLikeTestPage/index.html')
      open({appName: 'Eyes Selenium SDK - Special Cases', viewportSize})
      checkRegion('img', {inFrame: '[name="frame1"]'})
      close(throwException)
    },
    TestCheckRegionInAVeryBigFrameAfterManualSwitchToFrame: () => {
      visit('https://applitools.github.io/demo/TestPages/WixLikeTestPage/index.html')
      open({appName: 'Eyes Selenium SDK - Special Cases', viewportSize})
      switchToFrame('[name="frame1"]')
      checkRegion('img')
      close(throwException)
    },
    TestCheckRegionByCoordinates_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkRegion({left: 50, top: 50, width: 100, height: 100})
      close(throwException)
    },
    TestCheckRegionByCoordinateInFrame_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkRegion({left: 30, top: 40, width: 400, height: 1200}, {inFrame: '[name="frame1"]'})
      close(throwException)
    },
    TestCheckRegionByCoordinateInFrameFully_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkRegion(
        {left: 30, top: 40, width: 400, height: 1200},
        {inFrame: '[name="frame1"]', isFully: true},
      )
      close(throwException)
    },
    TestCheckRegionBySelectorAfterManualScroll_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      scrollDown(250)
      checkRegion('#centered')
      close(throwException)
    },
    TestCheckRegionInFrame: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      checkRegion('#inner-frame-div', {
        inFrame: '[name="frame1"]',
        isClassicApi: true,
        isFully: true,
      })
      close(throwException)
    },
    TestCheckRegionInFrame_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkRegion('#inner-frame-div', {
        inFrame: '[name="frame1"]',
        isFully: true,
      })
      close(throwException)
    },
    TestCheckRegionInFrame3_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkFrame('[name="frame1"]', {
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
      close(throwException)
    },
    TestCheckRegionWithIgnoreRegion_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkRegion('#overflowing-div', {
        ignoreRegion: {left: 50, top: 50, width: 100, height: 100},
      })
      close(throwException)
    },
    //TestCheckScrollableModal: () => {
    //  visit(url)
    //  open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    //  click('#centered')
    //  checkRegion('#modal-content', {scrollRootElement: '#modal1', isFully: true})
    //  close(throwException)
    //},
    TestCheckWindow: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      checkWindow({isClassicApi: true})
      close(throwException)
    },
    TestCheckWindow_Body: () => {
      visit('https://applitools.github.io/demo/TestPages/SimpleTestPage/scrollablebody.html')
      open({appName: 'Eyes Selenium SDK - Scroll Root Element', viewportSize})
      checkWindow({scrollRootElement: 'body', isFully: true})
      close(throwException)
    },
    TestCheckWindow_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkWindow()
      close(throwException)
    },
    TestCheckWindow_Html: () => {
      visit('https://applitools.github.io/demo/TestPages/SimpleTestPage/scrollablebody.html')
      open({appName: 'Eyes Selenium SDK - Scroll Root Element', viewportSize})
      checkWindow({scrollRootElement: 'html', isFully: true})
      close(throwException)
    },
    TestCheckWindow_Simple_Html: () => {
      visit('https://applitools.github.io/demo/TestPages/SimpleTestPage/index.html')
      open({appName: 'Eyes Selenium SDK - Scroll Root Element', viewportSize})
      checkWindow({scrollRootElement: 'html', isFully: true})
      close(throwException)
    },
    TestCheckWindowAfterScroll: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      scrollDown(350)
      checkWindow({isClassicApi: true})
      close(throwException)
    },
    TestCheckWindowFully: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      checkWindow({isClassicApi: true, isFully: true})
      close(throwException)
    },
    TestCheckWindowViewport: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      checkWindow({isClassicApi: true, isFully: false})
      close(throwException)
    },
    TestCheckWindowWithFloatingByRegion_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkWindow({
        floatingRegion: {
          target: {left: 10, top: 10, width: 20, height: 10},
          maxUp: 3,
          maxDown: 3,
          maxLeft: 20,
          maxRight: 30,
        },
      })
      close(throwException)
    },
    TestCheckWindowWithFloatingBySelector_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkWindow({
        floatingRegion: {
          target: '#overflowing-div',
          maxUp: 3,
          maxDown: 3,
          maxLeft: 20,
          maxRight: 30,
        },
      })
      close(throwException)
    },
    TestCheckWindowWithIgnoreBySelector_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkWindow({ignoreRegion: '#overflowing-div'})
      close(throwException)
    },
    TestCheckWindowWithIgnoreBySelector_Centered_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkWindow({ignoreRegion: '#centered'})
      close(throwException)
    },
    TestCheckWindowWithIgnoreBySelector_Stretched_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkWindow({ignoreRegion: '#stretched'})
      close(throwException)
    },
    TestCheckWindowWithIgnoreRegion_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      type('input', 'My Input')
      checkWindow({
        isFully: true,
        ignoreRegion: {left: 50, top: 50, width: 100, height: 100},
      })
      close(throwException)
    },
    TestDoubleCheckWindow: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
      checkWindow({isClassicApi: true, tag: 'first'})
      checkWindow({isClassicApi: true, tag: 'second'})
      close(throwException)
    },
    TestSimpleRegion: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkRegion({left: 50, top: 50, width: 100, height: 100})
      close(throwException)
    },
    TestScrollbarsHiddenAndReturned_Fluent: () => {
      visit(url)
      open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
      checkWindow({isFully: true})
      checkRegion('#inner-frame-div', {isFully: true})
      checkWindow({isFully: true})
      close(throwException)
    },
    //Test_VGTestsCount_1: () => {
    //  visit('https://applitools.com/helloworld')
    //  open({appName: 'Test Count', viewportSize: '640x480'})
    //  checkWindow({isFully: true})
    //  close(false) // VisualGridRunner::getAllResults doesn't call Eyes::close. In non-JS SDK's it does, but that should be deprecated. Users should be instructed to call close explicitly.
    //  assert.deepStrictEqual(getAllTestResults(throwException).length, 1)
    //},
  }
}

module.exports = {
  supportedCommands,
  makeCoverageTests,
}
