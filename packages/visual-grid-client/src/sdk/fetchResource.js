'use strict';
const retryFetch = require('@applitools/http-commons/src/retryFetch');
const createResourceCache = require('./createResourceCache');

function makeFetchResource({logger, retries = 5, fetchCache = createResourceCache(), fetch}) {
  return (url, opts) =>
    fetchCache.getValue(url) || fetchCache.setValue(url, doFetchResource(url, opts));

  function doFetchResource(url, opts) {
    return retryFetch(
      retry => {
        const retryStr = retry ? `(retry ${retry}/${retries})` : '';
        const optsStr = JSON.stringify(opts) || '';
        logger.verbose(`fetching ${url} ${retryStr} ${optsStr}`);

        return fetch(url, opts).then(resp =>
          (resp.buffer ? resp.buffer() : resp.arrayBuffer().then(buff => Buffer.from(buff))).then(
            buff => ({
              url,
              type: resp.headers.get('Content-Type'),
              value: buff,
            }),
          ),
        );
      },
      {retries},
    ).then(result => {
      logger.verbose(`fetched ${url}`);
      return result;
    });
  }
}

module.exports = makeFetchResource;
