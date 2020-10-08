/* global window, document */

function scrollPage(
  {scrollAmount = 500, timeInterval = 300} = {scrollAmount: 500, timeInterval: 300},
) {
  const timeout = (50000 / scrollAmount) * timeInterval * 2 + 5000
  let resolve, reject, timeoutId
  let isAborted = false
  const p = new Promise((res, rej) => ((resolve = res), (reject = rej)))

  function doScan(isUp) {
    if (isAborted) {
      return
    }
    const originalOffset = window.pageYOffset
    const yDiff = isUp ? -1 * scrollAmount : scrollAmount
    if (window.scrollTo) {
      window.scrollTo(0, originalOffset + yDiff)
    } else {
      document.documentElement.scrollTop = originalOffset + yDiff
    }
    if (window.pageYOffset !== originalOffset) {
      setTimeout(doScan, timeInterval, isUp)
    } else if (originalOffset > 0) {
      setTimeout(doScan, timeInterval, true)
    } else {
      clearTimeout(timeoutId)
      resolve()
    }
  }

  timeoutId = setTimeout(
    () => ((isAborted = true), reject()),
    timeout,
    'scrollPage timed out after ${timeout}ms!',
  )
  doScan(false)
  return p
}

module.exports = scrollPage
