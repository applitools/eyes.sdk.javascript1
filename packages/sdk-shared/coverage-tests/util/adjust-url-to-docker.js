// This is why we can't have nice things
// https://github.com/docker/compose/issues/3800#issuecomment-496480571
function adjustUrlToDocker(url, {platform = process.platform} = {}) {
  if (!!process.env.CVG_TESTS_REMOTE && platform === 'darwin')
    return url.replace(/:\/\/localhost/, '://host.docker.internal')
  return url
}

module.exports = adjustUrlToDocker
