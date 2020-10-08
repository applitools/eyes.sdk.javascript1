'use strict'

const {
  GeneralUtils: {pexec, cachify, presult},
} = require('..')

async function doGetScmInfo(branchName, parentBranchName, _opts) {
  const commitTimeCmd = `HASH=$(git merge-base ${branchName} ${parentBranchName}) && git show -q --format=%cI $HASH`
  let [{stderr} = {}, {stdout} = {}] = await presult(pexec(commitTimeCmd, _opts))

  // missing branch info
  let missingBranch = _missingBranchName(stderr)
  if (missingBranch) {
    const fetchBranchCmd = `git fetch origin ${missingBranch}:${missingBranch}`
    ;[{stderr} = {}, {stdout} = {}] = await presult(
      pexec(`${fetchBranchCmd} && ${commitTimeCmd}`, _opts),
    )
  }

  // missing current branch commits
  if (!stdout) {
    const fetchBranchCmd = 'git fetch origin --unshallow'
    ;[{stderr} = {}, {stdout} = {}] = await presult(
      pexec(`${fetchBranchCmd} && ${commitTimeCmd}`, _opts),
    )
  }

  if (stdout) {
    stdout = stdout.replace(/\s/g, '')
  }
  if (!_isCorrectInfo(stdout)) {
    throw new Error(`stderr: ${stderr}, stdout: ${stdout}`)
  }

  return stdout
}

function _isCorrectInfo(stdout) {
  return stdout && stdout.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}/)
}

function _missingBranchName(stderr) {
  const m = stderr && stderr.match(/Not a valid object name ([^\s]+)/)
  return m && m[1]
}

module.exports = cachify(doGetScmInfo, true)
