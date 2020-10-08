// this middleware causes smurfs.jpg to be served only outside of the browser
module.exports = (req, res, next) => {
  if (req.url === '/smurfs.jpg') {
    if (/Mozilla/.test(req.headers['user-agent'])) {
      res.status(404).send('Not found')
    } else {
      next()
    }
  } else {
    next()
  }
}
