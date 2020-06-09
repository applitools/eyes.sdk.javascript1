'use strict'

const axios = require('axios')
const assert = require('assert')
const {DeviceName} = require('../../index')
const VG_BACKWARD_COMPATIBLE = [
  'Samsung Galaxy S8',
  'Samsung Galaxy A5',
  'Galaxy S III',
  'Galaxy Note II',
]

describe('DeviceName', function() {
  let expectdDeviceNames
  before(async () => {
    const url = 'https://render-wus.applitools.com/emulated-devices'
    expectdDeviceNames = (await axios.get(url)).data
    expectdDeviceNames = expectdDeviceNames.devices.map(d => d.deviceName)
    expectdDeviceNames = expectdDeviceNames.filter(
      device => !VG_BACKWARD_COMPATIBLE.includes(device),
    )
  })

  it('has correct values', async function() {
    expectdDeviceNames = assert.deepStrictEqual(
      Object.values(DeviceName).sort(),
      expectdDeviceNames.sort(),
    )
  })
})
