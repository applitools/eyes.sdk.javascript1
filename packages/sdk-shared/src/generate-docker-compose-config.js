const fs = require('fs')
const path = require('path')

function generateDockerComposeConfig({saveToDisk, platform = process.platform} = {}) {
  let config = {}
  config.version = '3.4'
  config.services = {
    chrome: {
      image: 'selenium/standalone-chrome:3.141.59-20200515',
      volumes: ['/dev/shm:/dev/shm'],
      ...generateNetworkConfigForPlatform(platform),
    },
    firefox: {
      image: 'selenium/standalone-firefox',
      volumes: ['/dev/shm:/dev/shm'],
      ports: ['4445:4444'],
    },
  }
  const result = JSON.stringify(config)
  if (!saveToDisk) return result
  fs.writeFileSync(path.resolve(process.cwd(), 'docker-compose.yaml'), result)
}

function generateNetworkConfigForPlatform(platform) {
  return platform === 'linux'
    ? {network_mode: 'host'}
    : {
        ports: [
          '4444:4444',
          {
            target: '5555',
            protocol: 'tcp',
            mode: 'host',
          },
          {
            target: '5556',
            protocol: 'tcp',
            mode: 'host',
          },
          {
            target: '5557',
            protocol: 'tcp',
            mode: 'host',
          },
        ],
      }
}

if (require.main === module) {
  generateDockerComposeConfig({saveToDisk: true})
}

module.exports = generateDockerComposeConfig
