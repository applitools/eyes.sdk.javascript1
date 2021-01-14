const EyesClassic = require('./EyesClassic')
const EyesVisualGrid = require('./EyesVisualGrid')
const EyesFactory = require('./EyesFactory')
const EyesDriver = require('./EyesDriver')
const EyesContext = require('./EyesContext')
const EyesElement = require('./EyesElement')
const CheckSettings = require('../fluent/DriverCheckSettings')

function EyesSDK({name, version, spec, VisualGridClient}) {
  const SDKElement = EyesElement.specialize(spec)
  const SDKContext = EyesContext.specialize({
    ...spec,
    newElement(...args) {
      return new SDKElement(...args)
    },
  })
  const SDKDriver = EyesDriver.specialize({
    ...spec,
    newContext(...args) {
      return new SDKContext(...args)
    },
  })

  const SDKCheckSettings = CheckSettings.specialize({
    isElement(element) {
      return SDKContext.isElement(element)
    },
    isSelector(selector) {
      return SDKContext.isSelector(selector)
    },
    isContext(context) {
      return SDKContext.isReference(context)
    },
  })

  const SDKEyesClassic = EyesClassic.specialize({
    agentId: `${name}/${version}`,
    spec: {
      isElement(element) {
        return SDKContext.isElement(element)
      },
      isSelector(selector) {
        return SDKContext.isSelector(selector)
      },
      isContext(context) {
        return SDKContext.isReference(context)
      },
      newDriver(...args) {
        return new SDKDriver(...args)
      },
      newCheckSettings(...args) {
        return new SDKCheckSettings(...args)
      },
    },
  })

  const SDKEyesVisualGrid = EyesVisualGrid.specialize({
    agentId: `${name}.visualgrid/${version}`,
    spec: {
      isElement(element) {
        return SDKContext.isElement(element)
      },
      isSelector(selector) {
        return SDKContext.isSelector(selector)
      },
      isContext(context) {
        return SDKContext.isReference(context)
      },
      newDriver(...args) {
        return new SDKDriver(...args)
      },
      newCheckSettings(...args) {
        return new SDKCheckSettings(...args)
      },
    },
    VisualGridClient,
  })

  const SDKEyesFactory = EyesFactory.specialize({
    EyesClassic: SDKEyesClassic,
    EyesVisualGrid: SDKEyesVisualGrid,
  })

  return {
    Element: SDKElement,
    Context: SDKContext,
    Driver: SDKDriver,
    CheckSettings: SDKCheckSettings,
    EyesClassic: SDKEyesClassic,
    EyesVisualGrid: SDKEyesVisualGrid,
    EyesFactory: SDKEyesFactory,
  }
}

module.exports = EyesSDK
