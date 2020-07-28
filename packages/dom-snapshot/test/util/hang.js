module.exports = (req, _res, next) => {
  if (req.url !== '/hanging.css') {
    next();
  }
};
