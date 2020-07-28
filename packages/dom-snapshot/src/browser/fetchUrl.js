'use strict';

function makeFetchUrl({
  fetch = window.fetch,
  AbortController = window.AbortController,
  timeout = 10000,
}) {
  return function fetchUrl(url) {
    // Why return a `new Promise` like this? Because people like Atlassian do horrible things.
    // They monkey patched window.fetch, and made it so it throws a synchronous exception if the route is not well known.
    // Returning a new Promise guarantees that `fetchUrl` is the async function that it declares to be.
    return new Promise((resolve, reject) => {
      const controller = new AbortController();

      const timeoutId = setTimeout(() => {
        const err = new Error('fetchUrl timeout reached');
        err.isTimeout = true;
        reject(err);
        controller.abort();
      }, timeout);

      return fetch(url, {
        cache: 'force-cache',
        credentials: 'same-origin',
        signal: controller.signal,
      })
        .then(resp => {
          clearTimeout(timeoutId);
          if (resp.status === 200) {
            return resp.arrayBuffer().then(buff => ({
              url,
              type: resp.headers.get('Content-Type'),
              value: buff,
            }));
          } else {
            return {url, errorStatusCode: resp.status};
          }
        })
        .then(resolve)
        .catch(err => reject(err));
    });
  };
}

module.exports = makeFetchUrl;
