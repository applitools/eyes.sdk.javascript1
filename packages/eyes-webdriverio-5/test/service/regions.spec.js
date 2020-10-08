/* eslint-disable no-undef */
'use strict'

const {By, Target} = require('../..')

describe('EyesServiceTest', () => {
  beforeEach(() => {
    browser.url('https://cooking.nytimes.com/see-our-features')
  })

  it('checkWindow', () => {
    browser.eyesCheck(
      'see our features',
      Target.window()
        .layoutRegions(
          By.css('a.nytc---navbtn---desktop-link-child.nytc---navbtn---navLabel:first-of-type'),
        )
        .ignoreRegions(By.css('.features-onboarding-top-video')),
    )
  })
})
