module.exports = (_req, res, next) => {
  res.cookie('token', '12345')
  next()
}
