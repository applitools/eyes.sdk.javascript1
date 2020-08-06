module.exports = (req, res, next) => {
  if (req.headers.referer === 'http://localhost:5555/cors.html') {
    next()
  } else {
    res.status(404).send('Not found')
  }
}
