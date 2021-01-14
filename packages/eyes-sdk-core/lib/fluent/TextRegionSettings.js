const {Region, CoordinatesType} = require('../geometry/Region')

function makeTextRegionTarget(spec) {
  function TextRegionSettings(object) {
    const config = {
      context: null,
      target: null,
      fully: false,
    }

    const api = {
      frame(reference) {
        if (spec.isContext(reference)) {
          config.context = {reference, parent: config.context}
        } else {
          throw new TypeError('frame method called with argument of unknown type!')
        }
        return this
      },
      region(target) {
        if (Region.isRegionCompatible(target)) {
          config.target = new Region(target)
          config.target.setCoordinatesType(CoordinatesType.CONTEXT_RELATIVE)
        } else if (spec.isSelector(target) || spec.isElement(target)) {
          config.target = target
        } else {
          throw new TypeError('region method called with argument of unknown type!')
        }
        return this
      },
      scrollRootElement(scrollingElement) {
        if (spec.isSelector(scrollingElement) || spec.isElement(scrollingElement)) {
          if (config.context) {
            config.context.scrollRootElement = scrollingElement
          } else {
            config.scrollRootElement = scrollingElement
          }
        } else {
          throw new TypeError('scrollRootElement method called with argument of unknown type!')
        }
        return this
      },
      fully(fully = true) {
        config.fully = fully
        return this
      },
      patterns(patterns) {
        config.patterns = patterns
        return this
      },
      ignoreCase(ignoreCase = true) {
        config.ignoreCase = ignoreCase
        return this
      },
      firstOnly(firstOnly = true) {
        config.firstOnly = firstOnly
        return this
      },
      language(language) {
        config.language = language
        return this
      },
      toJSON() {
        return config
      },
    }

    if (object.scrollRootElement) {
      api.scrollRootElement(object.scrollRootElement)
    }
    if (object.frames) {
      object.frames.forEach(reference => {
        if (!reference) return
        if (reference.frame) {
          api.frame(reference.frame)
          if (reference.scrollRootElement) {
            api.scrollRootElement(reference.scrollRootElement)
          }
        } else {
          api.frame(reference)
        }
      })
    }
    if (object.region) {
      api.region(object.region)
    }
    if (object.isFully) {
      api.fully(object.isFully)
    }
    if (object.patterns) {
      api.patterns(object.patterns)
    }
    if (object.ignoreCase) {
      api.ignoreCase(object.ignoreCase)
    }
    if (object.firstOnly) {
      api.firstOnly(object.firstOnly)
    }
    if (object.language) {
      api.language(object.language)
    }

    return api
  }

  return {
    from(object) {
      return TextRegionSettings(object)
    },
    window() {
      return TextRegionSettings()
    },
    frame(reference) {
      return TextRegionSettings().frame(reference)
    },
    region(target) {
      return TextRegionSettings().region(target)
    },
  }
}

module.exports = makeTextRegionTarget
