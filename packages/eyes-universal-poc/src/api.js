const {Eyes, CheckSettings, ...others} = require('@applitools/eyes-api')

function makeAPI(spec) {
  class PlaywrightEyes extends Eyes {
    get _spec() {
      return spec
    }
  }
  class PlaywrightCheckSettings extends CheckSettings {
    get _spec() {
      return spec
    }
  }

  return {
    Eyes: PlaywrightEyes,
    Target: PlaywrightCheckSettings,
    ...others,
  }
}

module.exports = makeAPI
