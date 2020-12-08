// this middleware causes smurfs.jpg to be served only twice - once for the page and once for dom snapshot
const servedCount = {}
module.exports = (req, res, next) => {
    if (req.url.includes('smurfs')) {
      servedCount[req.url] = servedCount[req.url] ? servedCount[req.url] + 1 : 1
      if (servedCount[req.url] === 2) {
        res.status(404).send('Not found')
      } else {
        wasServed = true
        next()
      }
    } else {
      next()
    }
  }
  