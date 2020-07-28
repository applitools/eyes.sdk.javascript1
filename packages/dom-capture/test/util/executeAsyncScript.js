function executeAsyncScript(driver, func) {
  const script = `
    const callback = arguments[arguments.length - 1];
    (${func})().then(callback, function (err) { callback({ error: err && err.message || err })});
  `;
  return driver.executeAsyncScript(script);
}

module.exports = executeAsyncScript;
