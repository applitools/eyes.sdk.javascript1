module.exports = (_req, res, next) => {
  //   const {name, value} = req.query
  res.cookie('token', '12345', {domain: 'localhost', secure: true, sameSite: 'None', path: '/images/', httpOnly: false})
  next()
}
