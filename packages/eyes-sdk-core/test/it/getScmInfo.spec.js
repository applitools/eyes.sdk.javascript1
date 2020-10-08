'use strict'

const assert = require('assert')
const getScmInfo = require('../../lib/getScmInfo')
const {
  GeneralUtils: {pexec, presult},
} = require('../..')
const {resolve} = require('path')

describe('getScmInfo', () => {
  const testRepoPath = resolve(__dirname, '../fixtures/test-git-repo/')
  const remoteRepoDir = resolve(__dirname, '../fixtures/')

  before(async () => {
    // make test-git-repo dir a valid repo
    const gitDir = resolve(testRepoPath, '.git-dontignore')
    await pexec(`mv ${gitDir} ${gitDir.replace('-dontignore', '')}`)
  })

  after(async () => {
    const gitDir = resolve(testRepoPath, '.git')
    await pexec(`mv ${gitDir} ${gitDir}-dontignore`)
  })

  it('works and caches response', async () => {
    const result = await getScmInfo('master', 'some-feat', {cwd: testRepoPath})
    const testRepoBaseTime = '2020-02-06T15:20:56+02:00'
    assert.strictEqual(result, testRepoBaseTime)

    const result2 = await getScmInfo('master', 'some-feat', {cwd: __dirname})
    assert.strictEqual(result2, testRepoBaseTime)
  })

  describe('remote branches', () => {
    afterEach(async () => pexec(`rm -rf tmp_git_test/`, {cwd: remoteRepoDir}))

    it('fetches missing remote branch', async () => {
      // getScmInfo is cached per node process, so flush..
      delete require.cache[require.resolve('../../lib/getScmInfo')]
      const getScmInfo = require('../../lib/getScmInfo')

      await pexec(
        `git clone --single-branch --branch some-branch-name https://github.com/applitools/testing-exmaple-repo.git tmp_git_test`,
        {cwd: remoteRepoDir},
      )
      const remoteRepoPath = resolve(remoteRepoDir, 'tmp_git_test')
      const result = await getScmInfo('master', 'some-branch-name', {cwd: remoteRepoPath})
      const testRepoBaseTime = '2020-02-19T17:14:31+02:00'
      assert.strictEqual(result, testRepoBaseTime)
    })

    it('fetches missing commits in current branch', async () => {
      // getScmInfo is cached per node process, so flush..
      delete require.cache[require.resolve('../../lib/getScmInfo')]
      const getScmInfo = require('../../lib/getScmInfo')

      await pexec(
        `git clone --depth=1 --branch some-branch-name https://github.com/applitools/testing-exmaple-repo.git tmp_git_test`,
        {cwd: remoteRepoDir},
      )
      const remoteRepoPath = resolve(remoteRepoDir, 'tmp_git_test')
      const result = await getScmInfo('master', 'some-branch-name', {cwd: remoteRepoPath})
      const testRepoBaseTime = '2020-02-19T17:14:31+02:00'
      assert.strictEqual(result, testRepoBaseTime)
    })

    it("throws error when can't get the info", async () => {
      // getScmInfo is cached per node process, so flush..
      delete require.cache[require.resolve('../../lib/getScmInfo')]
      const getScmInfo = require('../../lib/getScmInfo')

      await pexec(
        `git clone --branch some-branch-name https://github.com/applitools/testing-exmaple-repo.git tmp_git_test`,
        {cwd: remoteRepoDir},
      )
      const remoteRepoPath = resolve(remoteRepoDir, 'tmp_git_test')
      const [err] = await presult(
        getScmInfo('not-there', 'some-branch-name', {cwd: remoteRepoPath}),
      )
      const expectedError = 'fatal: --unshallow on a complete repository does not make sense'
      assert.ok(err && err.message)
      assert.ok(err.message.includes(expectedError), `Got ${err.message} expected defined error`)
    })

    it('handles missing feature branch', async () => {
      // getScmInfo is cached per node process, so flush..
      delete require.cache[require.resolve('../../lib/getScmInfo')]
      const getScmInfo = require('../../lib/getScmInfo')

      await pexec(
        `git clone --single-branch --branch master https://github.com/applitools/testing-exmaple-repo.git tmp_git_test && 
         cd tmp_git_test && 
         git fetch origin +refs/pull/1/merge && 
         git checkout -qf FETCH_HEAD`,
        {
          cwd: remoteRepoDir,
        },
      )
      const remoteRepoPath = resolve(remoteRepoDir, 'tmp_git_test')
      const [, res] = await presult(getScmInfo('some-branch-name', 'master', {cwd: remoteRepoPath}))
      const testRepoBaseTime = '2020-02-19T17:14:31+02:00'
      assert.strictEqual(res, testRepoBaseTime)
    })
  })
})
