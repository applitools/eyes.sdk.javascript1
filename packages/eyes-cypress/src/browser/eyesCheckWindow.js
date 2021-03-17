/* global cy*/
'use strict';

const getAllBlobs = require('./getAllBlobs');
const getBrowserInfo = require('./getBrowserInfo');

function makeEyesCheckWindow({sendRequest, processPage, domSnapshotOptions, cypress = cy}) {
  return function eyesCheckWindow(doc, args = {}) {
    return takeDomSnapshots(domSnapshotOptions).then(snapshot => {
      // console.log("%cDone taking snapshots!", "color:chartreuse");
      return sendRequest({
        command: 'checkWindow',
        data: {
          url: Array.isArray(snapshot) ? snapshot[0].url : snapshot.url,
          snapshot,
          ...args,
        },
      });
    });

    function takeDomSnapshots(options) {
      const browser = args.browser;
      const breakpoints = args.layoutBreakpoints;
      const browsers = Array.isArray(browser) ? browser : [browser];

      if (!breakpoints) {
        //console.log('no breakpoints, taking single dom snapshot');
        return takeDomSnapshot(options);
      }

      return browsers
        .reduce((widths, browser, index) => {
          return widths.then(widthsMap => {
            return getBrowserInfo(browser, sendRequest).then(({name, width}) => {
              const requiredWidth = getBreakpointWidth(breakpoints, width);
              let groupedBrowsers = widthsMap[requiredWidth];
              if (!groupedBrowsers) {
                groupedBrowsers = [];
                widthsMap[requiredWidth] = groupedBrowsers;
              }
              groupedBrowsers.push({index, width, name});
              return widthsMap;
            });
          });
        }, cypress.wrap({}, {log: false}))
        .then(requiredWidths => {
          const {innerWidth: width, innerHeight: height} = doc.defaultView;
          const snapshots = Array(browsers.length);
          const requiredWidthsKeys = Object.keys(requiredWidths);
          for (const requiredWidth of requiredWidthsKeys) {
            const browsersInfo = requiredWidths[requiredWidth];
            // console.log(`taking dom snapshot for width ${requiredWidth}`);
            cypress
              .viewport(Number(requiredWidth), height, {log: false})
              .wait(300, {log: false})
              .then({log: false, timeout: 900000}, () => {
                return takeDomSnapshot(options).then(snapshot => {
                  browsersInfo.forEach(({index}) => (snapshots[index] = snapshot));
                });
              });
          }
          return cypress
            .viewport(width, height, {log: false})
            .wait(0, {log: false})
            .then(() => snapshots);
        });
    }

    function takeDomSnapshot(options) {
      // console.log(`take dom snapshot with ${doc.defaultView.innerWidth}`);
      return processPage(Object.assign({doc}, options)).then(mainFrame => {
        const allBlobs = getAllBlobs(mainFrame)
          .filter(blob => !blob.errorStatusCode)
          .map(mapBlob);
        const snapshot = replaceBlobsWithBlobDataInFrame(mainFrame);
        return Promise.all(allBlobs.map(putResource)).then(() => snapshot);

        function putResource({url, value}) {
          return sendRequest({
            command: `resource/${encodeURIComponent(url)}`,
            data: value,
            method: 'PUT',
            headers: {'Content-Type': 'application/octet-stream'},
          }).catch(_e => {
            snapshot.blobData.splice(
              snapshot.blobData.findIndex(({url: blobUrl}) => blobUrl === url),
              1,
            );
            snapshot.resourceUrls.push(url);
          });
        }
      });
    }

    function getBreakpointWidth(breakpoints, width) {
      if (!Array.isArray(breakpoints) || breakpoints.length === 0) return width;
      const sortedBreakpoints = Array.from(new Set(breakpoints)).sort((a, b) => (a < b ? 1 : -1));
      const breakpoint = sortedBreakpoints.find(sortedBreakpoint => width >= sortedBreakpoint);
      return breakpoint || sortedBreakpoints[breakpoints.length - 1] - 1;
    }
  };
}

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

module.exports = makeEyesCheckWindow;
