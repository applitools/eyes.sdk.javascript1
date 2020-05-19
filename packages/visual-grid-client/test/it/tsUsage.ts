'use strict';

import Eyes from './tsEyes'
const eyes = new Eyes()

eyes.open({appName: 'App', testName: 'helloworld'})

eyes.open({
  browser: [
    {width: 800, height: 600, name: 'firefox'},
    {width: 1024, height: 768, name: 'chrome'},
    {width: 1024, height: 768, name: 'ie11'},
    {width: 1024, height: 768}, // chrome is the default
  ]
});

eyes.open({
  accessibilitySettings: { level: 'AA', guidelinesVersion: 'WCAG_2_0'},
})

eyes.check({
  tag: 'page loaded 4',
});

eyes.check({
  layout: [
    {top: 100, left: 0, width: 1000, height: 100},
    {selector: '.some-div-to-test-as-layout'},
  ],
  strict: [
    {top: 100, left: 0, width: 1000, height: 100},
    {selector: '.some-div-to-test-as-strict'},
  ],
  content: [
    {top: 100, left: 0, width: 1000, height: 100},
    {selector: '.some-div-to-test-as-content'},
  ],
  scriptHooks: {
    beforeCaptureScreenshot: "document.body.style.backgroundColor = 'gold'"
  },
  sendDom: false,
  accessibility: [
    {accessibilityType: 'RegularText', selector: '.some-div'},
    {accessibilityType: 'LargeText', selector: '//*[@id="main"]/h1', type: 'xpath'},
    {accessibilityType: 'BoldText', top: 100, left: 0, width: 1000, height: 100},
  ],
  ignore: [
    {top: 100, left: 0, width: 1000, height: 100},
    {selector: '.some-div-to-ignore'},
  ],
  floating: [
    {top: 100, left: 0, width: 1000, height: 100, maxUpOffset: 20, maxDownOffset: 20, maxLeftOffset: 20, maxRightOffset: 20},
    {selector: '.some-div-to-float', maxUpOffset: 20, maxDownOffset: 20, maxLeftOffset: 20, maxRightOffset: 20},
  ]
});

eyes.check({
  target: 'region',
  region: {top: 100, left: 0, width: 1000, height: 200}
});

// The shorthand string version defaults to css selectors
eyes.check({
  target: 'region',
  selector: '.my-element'
});

// Using a css selector
eyes.check({
  target: 'region',
  selector: {
    type: 'css',
    selector: '.my-element' // or '//button'
  }
});

// Using an xpath selector
eyes.check({
  target: 'region',
  selector: {
    type: 'xpath',
    selector: '//button[1]'
  }
});

// capture viewport only
eyes.check({
  target: 'window',
  fully: false,
});
