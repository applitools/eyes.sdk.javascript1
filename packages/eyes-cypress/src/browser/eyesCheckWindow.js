'use strict';
const getAllBlobs = require('./getAllBlobs');

function makeEyesCheckWindow({sendRequest, processPage}) {
  return function eyesCheckWindow(doc, args) {
    let tag,
      sizeMode,
      target,
      fully,
      selector,
      region,
      scriptHooks,
      ignore,
      floating,
      layout,
      content,
      strict,
      sendDom,
      useDom,
      enablePatterns,
      ignoreDisplacements,
      accessibility,
      matchLevel,
      visualGridOptions;
    if (typeof args === 'string') {
      tag = args;
    } else if (typeof args === 'object') {
      tag = args.tag;
      sizeMode = args.sizeMode;
      target = args.target;
      fully = args.fully;
      selector = args.selector;
      region = args.region;
      scriptHooks = args.scriptHooks;
      ignore = args.ignore;
      floating = args.floating;
      layout = args.layout;
      strict = args.strict;
      content = args.content;
      sendDom = args.sendDom;
      useDom = args.useDom;
      enablePatterns = args.enablePatterns;
      ignoreDisplacements = args.ignoreDisplacements;
      accessibility = args.accessibility;
      matchLevel = args.matchLevel;
      visualGridOptions = args.visualGridOptions;
    }

    return processPage(doc).then(mainFrame => {
      const allBlobs = getAllBlobs(mainFrame)
        .filter(blob => !blob.errorStatusCode)
        .map(mapBlob);
      const {resourceUrls, blobData, frames, url, cdt} = replaceBlobsWithBlobDataInFrame(mainFrame);
      return Promise.all(allBlobs.map(putResource)).then(() =>
        sendRequest({
          command: 'checkWindow',
          data: {
            url,
            resourceUrls,
            cdt,
            tag,
            sizeMode,
            target,
            fully,
            blobData,
            selector,
            region,
            scriptHooks,
            ignore,
            floating,
            layout,
            content,
            strict,
            frames,
            sendDom,
            useDom,
            enablePatterns,
            ignoreDisplacements,
            accessibility,
            matchLevel,
            visualGridOptions,
          },
        }),
      );

      function putResource({url, value}) {
        return sendRequest({
          command: `resource/${encodeURIComponent(url)}`,
          data: value,
          method: 'PUT',
          headers: {'Content-Type': 'application/octet-stream'},
        }).catch(_e => {
          blobData.splice(
            blobData.findIndex(({url: blobUrl}) => blobUrl === url),
            1,
          );
          resourceUrls.push(url);
        });
      }
    });
  };

  function replaceBlobsWithBlobDataInFrame({url, cdt, resourceUrls, blobs, frames}) {
    return {
      url,
      cdt,
      resourceUrls,
      blobData: blobs.map(mapBlobData),
      frames: frames.map(replaceBlobsWithBlobDataInFrame),
    };
  }

  function mapBlobData(blob) {
    if (blob.errorStatusCode) {
      return {url: blob.url, errorStatusCode: blob.errorStatusCode};
    } else {
      return {url: blob.url, type: blob.type || 'application/x-applitools-unknown'};
    }
  }

  function mapBlob({url, type, value}) {
    return {url, type: type || 'application/x-applitools-unknown', value};
  }
}

module.exports = makeEyesCheckWindow;
