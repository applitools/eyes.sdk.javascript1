const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '..', '.travis.yml'), 'utf8'))
const pkgs = makePackagesList()

config.jobs = {
  include: [...makeJobsForLintStage(), ...makeJobsForUnitStage(), ...makeJobsForItStage()],
}

fs.writeFileSync(path.join(__dirname, '..', '.travis.yml'), yaml.safeDump(config))

function makeJobsForLintStage() {
  return makeStageWithSingleJob({stageName: 'lint', scriptName: 'lint'})
}

function makeJobsForUnitStage() {
  return makeStageWithJobsForEachPackage({stageName: 'unit tests', scriptName: 'test:unit'})
}

function makeJobsForItStage() {
  return makeStageWithJobsForEachPackage({stageName: 'end-to-end tests', scriptName: 'test:it'})
}

function makePackagesList() {
  const packages = require(path.join(__dirname, '..', 'package.json')).workspaces
  return packages.map(pkgPath => {
    const pkgDir = path.join(__dirname, '..', pkgPath)
    const packageJson = require(path.join(pkgDir, 'package.json'))
    return {
      name: packageJson.name,
      path: pkgPath,
      scripts: {...packageJson.scripts},
    }
  })
}

function makeStageWithSingleJob({stageName, scriptName}) {
  return [{stage: stageName, script: `yarn ${scriptName}`}]
}

function makeStageWithJobsForEachPackage({stageName, scriptName}) {
  let jobs = []
  pkgs.forEach(pkg => {
    if (pkg.scripts.hasOwnProperty(scriptName)) {
      jobs.push({
        name: pkg.name,
        script: `cd ${pkg.path}; yarn ${scriptName}`,
      })
    }
  })
  if (jobs.length) jobs[0].stage = stageName
  return jobs
}
