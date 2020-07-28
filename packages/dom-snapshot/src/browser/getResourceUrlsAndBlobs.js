'use strict';

function makeGetResourceUrlsAndBlobs({processResource, aggregateResourceUrlsAndBlobs}) {
  return function getResourceUrlsAndBlobs({
    documents,
    urls,
    forceCreateStyle = false,
    skipResources,
  }) {
    return Promise.all(
      urls.map(url =>
        processResource({url, documents, getResourceUrlsAndBlobs, forceCreateStyle, skipResources}),
      ),
    ).then(resourceUrlsAndBlobsArr => aggregateResourceUrlsAndBlobs(resourceUrlsAndBlobsArr));
  };
}

module.exports = makeGetResourceUrlsAndBlobs;
