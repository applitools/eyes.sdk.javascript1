module.exports = (_req, res, next) => {
  res.cookie('token', '12345', {
    domain: 'localhost',
    // path: '/images/',
    expires: new Date(Date.now() + 10000),
  })
  next()
}
