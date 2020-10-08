const Handlebars = require('handlebars')
const {readFileSync} = require('fs')

const getFilePath = (url, staticPath) => {
  return `${staticPath}${url}`
}

module.exports = {
  generateMiddleware: ({hbData, staticPath}) => (req, res, next) => {
    if (/\.hbs$/.test(req.url)) {
      const data = JSON.parse(hbData)
      const filePath = getFilePath(req.url, staticPath)
      const file = readFileSync(filePath).toString()
      const compiled = Handlebars.compile(file)(data)
      res.send(compiled)
    } else {
      next()
    }
  },
}
