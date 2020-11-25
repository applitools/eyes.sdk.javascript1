const assert = require('assert')
const {gitStatus, isChanged} = require('../../src/git')
const jsonFile = require('./fixtures/changed.json')
const path = require('path')
// eslint-disable-next-line node/no-unsupported-features/node-builtins
const fs = require('fs').promises

async function randomizeJson() {
  const json = {...jsonFile}
  json.change = Math.random(1)
  await fs.writeFile(path.join(__dirname, 'fixtures/changed.json'), JSON.stringify(json, null, 2))
}

describe('git', () => {
  afterEach(async () => {
    await fs.writeFile(
      path.join(__dirname, 'fixtures/changed.json'),
      JSON.stringify(jsonFile, null, 2),
    )
  })

  it('should get changed files', async () => {
    await randomizeJson()
    const changed = await isChanged('test/git/fixtures/changed.json')
    assert.strictEqual(changed, true)
  })

  it('should do git status', async () => {
    await randomizeJson()
    const {stdout} = await gitStatus()
    assert(stdout.includes('changed.json'))
  })
})
