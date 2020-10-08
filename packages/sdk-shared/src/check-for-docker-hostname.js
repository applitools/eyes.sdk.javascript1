const dns = require('dns')

// This check is to support coverage tests when running on Mac by informing
// a developer than some additional (manual) configuration is required.
// For context: the coverage tests run inside of a container, and on Mac, "localhost"
// doesn't exist. To account for this, we preprocess the URL and switch it from localhost
// to host.docker.internal. But why do we also need this to resolve outside of
// the container? Because of tests which need to perform a fetch outside of the browser
// (from the host machine, not the container) and are referencing host.docker.internal
// (e.g., TestDisableBrowserFetching).
async function checkForDockerHostname({platform = process.platform} = {}) {
  if (platform !== 'darwin') return
  const address = 'host.docker.internal'
  return new Promise((resolve, reject) => {
    dns.lookup(address, err => {
      if (err) {
        reject({
          message: `Unable to resolve ${address}. You need to specify this in your /etc/hosts file.
          e.g., 127.0.0.1 ${address}`,
        })
      }
      resolve(address)
    })
  })
}

module.exports = checkForDockerHostname
