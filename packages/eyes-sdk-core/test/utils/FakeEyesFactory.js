const {EyesFactory} = require('../../index')
const FakeEyesClassic = require('./FakeEyesClassic')
const FakeEyesVisualGrid = require('./FakeEyesVisualGrid')

module.exports = EyesFactory.specialize({
  EyesClassic: FakeEyesClassic,
  EyesVisualGrid: FakeEyesVisualGrid,
})
