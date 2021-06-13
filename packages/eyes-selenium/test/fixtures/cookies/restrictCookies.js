module.exports = (req, res, next) => {
  const {cookies, method} = req
  if (method === 'GET') {
    if (cookies['token'] !== '12345') {
      return res.sendStatus(403)
    }
  }
  next()
}
