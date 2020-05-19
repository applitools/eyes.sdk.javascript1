'use strict'

const {resolve} = require('path')
const {describe, it} = require('mocha')
const {exec} = require('child_process')
const {promisify: p} = require('util')
const pexec = p(exec)

describe('typescript', () => {
  it('compiles with defenition file', async () => {
    const exampleFile = resolve(__dirname, './tsUsage.ts')
    try {
      await pexec(`tsc ${exampleFile} --noEmit`, {
        maxBuffer: 10000000,
      })
    } catch (ex) {
      console.error('Typescript compiling error:', ex.stdout)
      throw `Typescript compiling error: ${ex.stdout}`
    }
  })
})
