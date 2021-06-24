module.exports = (req, res, next) => {
  const {query} = req
  if (Object.keys(query).length) {
    res.cookie(query.name, query.value, query)
  }
  next()
}
