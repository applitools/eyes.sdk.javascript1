// this middleware causes any request to be delayed for a configurable amount of time
module.exports = async (req, res, next) => {
  const extensions = ['jpg', 'css', 'jpeg', 'png'];
  const currentExtension = req.url.split('.')[1];
  if (extensions.includes(currentExtension)) { 
    setTimeout(next, 5000);
  } else {
    next()
  }
}
