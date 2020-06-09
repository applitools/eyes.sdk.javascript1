const {Eyes} = require('../..')
const assert = require('assert')

describe('EyesWDIO', () => {
  it('should register with the runner', async () => {
    const eyes = new Eyes()
    assert.deepStrictEqual(eyes.getRunner()._eyesInstances, [eyes])
  })
})
