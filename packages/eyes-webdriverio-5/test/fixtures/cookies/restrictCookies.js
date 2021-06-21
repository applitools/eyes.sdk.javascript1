module.exports = (req, res, next) => {
  const {cookies, method} = req
  if (req.url.includes('/images/')) {
    if (method === 'GET' && !cookies['token']) {
      return res.sendStatus(403)
    }
  }

  next()
}
