/* @applitools/dom-capture@7.2.6 */
'use strict';

const styleProps = [
  'background-repeat',
  'background-origin',
  'background-position',
  'background-color',
  'background-image',
  'background-size',
  'border-width',
  'border-color',
  'border-style',
  'color',
  'display',
  'font-size',
  'font-weight',
  'line-height',
  'margin',
  'opacity',
  'overflow',
  'padding',
  'visibility',
];

const rectProps = ['width', 'height', 'top', 'left'];

const ignoredTagNames = ['HEAD', 'SCRIPT'];

var defaultDomProps = {
  styleProps,
  rectProps,
  ignoredTagNames,
};

const bgImageRe = /url\((?!['"]?:)['"]?([^'")]*)['"]?\)/;

function getBackgroundImageUrl(cssText) {
  const match = cssText ? cssText.match(bgImageRe) : undefined;
  return match ? match[1] : match;
}

var getBackgroundImageUrl_1 = getBackgroundImageUrl;

const psetTimeout = t =>
  new Promise(res => {
    setTimeout(res, t);
  });

async function getImageSizes({bgImages, timeout = 5000, Image = window.Image}) {
  return (
    await Promise.all(
      Array.from(bgImages).map(url =>
        Promise.race([
          new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve({url, width: img.naturalWidth, height: img.naturalHeight});
            img.onerror = () => resolve();
            img.src = url;
          }),
          psetTimeout(timeout),
        ]),
      ),
    )
  ).reduce((images, curr) => {
    if (curr) {
      images[curr.url] = {width: curr.width, height: curr.height};
    }
    return images;
  }, {});
}

var getImageSizes_1 = getImageSizes;

function genXpath(el) {
  if (!el.ownerDocument) return ''; // this is the document node

  let xpath = '',
    currEl = el,
    doc = el.ownerDocument,
    frameElement = doc.defaultView.frameElement;
  while (currEl !== doc) {
    xpath = `${currEl.tagName}[${getIndex(currEl)}]/${xpath}`;
    currEl = currEl.parentNode;
  }
  if (frameElement) {
    xpath = `${genXpath(frameElement)},${xpath}`;
  }
  return xpath.replace(/\/$/, '');
}

function getIndex(el) {
  return (
    Array.prototype.filter
      .call(el.parentNode.childNodes, node => node.tagName === el.tagName)
      .indexOf(el) + 1
  );
}

var genXpath_1 = genXpath;

function isInlineFrame(frame) {
  return (
    !/^https?:.+/.test(frame.src) ||
    (frame.contentDocument &&
      frame.contentDocument.location &&
      ['about:blank', 'about:srcdoc'].includes(frame.contentDocument.location.href))
  );
}

var isInlineFrame_1 = isInlineFrame;

function absolutizeUrl(url, absoluteUrl) {
  return new URL(url, absoluteUrl).href;
}

var absolutizeUrl_1 = absolutizeUrl;

function makeGetBundledCssFromCssText({
  parseCss,
  CSSImportRule,
  absolutizeUrl,
  getCssFromCache,
  unfetchedToken,
}) {
  return function getBundledCssFromCssText(cssText, styleBaseUrl) {
    let unfetchedResources;
    let bundledCss = '';

    try {
      const styleSheet = parseCss(cssText);
      for (const rule of Array.from(styleSheet.cssRules)) {
        if (rule instanceof CSSImportRule) {
          const nestedUrl = absolutizeUrl(rule.href, styleBaseUrl);
          const nestedResource = getCssFromCache(nestedUrl);
          if (nestedResource !== undefined) {
            const {
              bundledCss: nestedCssText,
              unfetchedResources: nestedUnfetchedResources,
            } = getBundledCssFromCssText(nestedResource, nestedUrl);

            nestedUnfetchedResources && (unfetchedResources = new Set(nestedUnfetchedResources));
            bundledCss = `${nestedCssText}${bundledCss}`;
          } else {
            unfetchedResources = new Set([nestedUrl]);
            bundledCss = `\n${unfetchedToken}${nestedUrl}${unfetchedToken}`;
          }
        }
      }
    } catch (ex) {
      console.log(`error during getBundledCssFromCssText, styleBaseUrl=${styleBaseUrl}`, ex);
    }

    bundledCss = `${bundledCss}${getCss(cssText, styleBaseUrl)}`;

    return {
      bundledCss,
      unfetchedResources,
    };
  };
}

function getCss(newText, url) {
  return `\n/** ${url} **/\n${newText}`;
}

var getBundledCssFromCssText = makeGetBundledCssFromCssText;

function parseCss(styleContent) {
  var doc = document.implementation.createHTMLDocument(''),
    styleElement = doc.createElement('style');
  styleElement.textContent = styleContent;
  // the style will only be parsed once it is added to a document
  doc.body.appendChild(styleElement);

  return styleElement.sheet;
}

var parseCss_1 = parseCss;

function makeFetchCss(fetch, {fetchTimeLimit} = {}) {
  return async function fetchCss(url) {
    const controller = new AbortController();
    const response = fetch(url, {cache: 'force-cache', signal: controller.signal})
      .then(response => {
        if (response.ok) {
          return response.text();
        }
        console.log('/failed to fetch (status ' + response.status + ') css from: ' + url + '/');
      })
      .catch(err => {
        console.log('/failed to fetch (error ' + err.toString() + ') css from: ' + url + '/');
      });
    const result = [response];
    if (!Number.isNaN(Number(fetchTimeLimit))) {
      result.push(
        new Promise(resolve => setTimeout(resolve, fetchTimeLimit)).then(() => controller.abort()),
      );
    }
    return Promise.race(result);
  };
}

var fetchCss = makeFetchCss;

var getHrefAttr = function getHrefAttr(node) {
  const attr = Array.from(node.attributes).find(attr => attr.name.toLowerCase() === 'href');
  return attr && attr.value;
};

var isLinkToStyleSheet = function isLinkToStyleSheet(node) {
  if (node.nodeName && node.nodeName.toUpperCase() === 'LINK' && node.attributes) {
    const attributes = new Map(
      Array.from(node.attributes, attr => [attr.name.toLowerCase(), attr.value.toLowerCase()]),
    );
    return (
      attributes.get('rel') === 'stylesheet' ||
      (attributes.get('as') === 'style' && ['preload', 'prefetch'].includes(attributes.get('rel')))
    );
  } else {
    return false;
  }
};

function isDataUrl(url) {
  return url && url.startsWith('data:');
}

var isDataUrl_1 = isDataUrl;

function makeExtractCssFromNode({getCssFromCache, absolutizeUrl}) {
  return function extractCssFromNode(node, baseUrl) {
    let cssText, styleBaseUrl, isUnfetched;
    if (isStyleElement(node)) {
      cssText = Array.from(node.childNodes)
        .map(node => node.nodeValue)
        .join('');
      styleBaseUrl = baseUrl;
    } else if (isLinkToStyleSheet(node)) {
      const href = getHrefAttr(node);
      if (!isDataUrl_1(href)) {
        styleBaseUrl = absolutizeUrl(href, baseUrl);
        cssText = getCssFromCache(styleBaseUrl);
      } else {
        styleBaseUrl = baseUrl;
        cssText = href.match(/,(.+)/)[1];
      }
      isUnfetched = cssText === undefined;
    }
    return {cssText, styleBaseUrl, isUnfetched};
  };
}

function isStyleElement(node) {
  return node.nodeName && node.nodeName.toUpperCase() === 'STYLE';
}

var extractCssFromNode = makeExtractCssFromNode;

function makeCaptureNodeCss({extractCssFromNode, getBundledCssFromCssText, unfetchedToken}) {
  return function captureNodeCss(node, baseUrl) {
    const {styleBaseUrl, cssText, isUnfetched} = extractCssFromNode(node, baseUrl);

    let unfetchedResources;
    let bundledCss = '';
    if (cssText) {
      const {bundledCss: nestedCss, unfetchedResources: nestedUnfetched} = getBundledCssFromCssText(
        cssText,
        styleBaseUrl,
      );

      bundledCss += nestedCss;
      unfetchedResources = new Set(nestedUnfetched);
    } else if (isUnfetched) {
      bundledCss += `${unfetchedToken}${styleBaseUrl}${unfetchedToken}`;
      unfetchedResources = new Set([styleBaseUrl]);
    }
    return {bundledCss, unfetchedResources};
  };
}

var captureNodeCss = makeCaptureNodeCss;

const NODE_TYPES = {
  ELEMENT: 1,
  TEXT: 3,
  DOCUMENT_FRAGMENT: 11,
};

var nodeTypes = {NODE_TYPES};

const {NODE_TYPES: NODE_TYPES$1} = nodeTypes;






function makePrefetchAllCss(fetchCss) {
  return async function prefetchAllCss(doc = document) {
    const cssMap = {};
    const start = Date.now();
    const promises = [];
    doFetchAllCssFromFrame(doc, doc.location.href, cssMap, promises);
    await Promise.all(promises);
    console.log('[prefetchAllCss]', Date.now() - start);

    return function fetchCssSync(url) {
      return cssMap[url];
    };

    async function fetchNodeCss(node, baseUrl, cssMap) {
      let cssText, resourceUrl;
      if (isLinkToStyleSheet(node)) {
        resourceUrl = absolutizeUrl_1(getHrefAttr(node), baseUrl);
        cssText = await fetchCss(resourceUrl);
        if (cssText !== undefined) {
          cssMap[resourceUrl] = cssText;
        }
      }
      if (cssText) {
        await fetchBundledCss(cssText, resourceUrl, cssMap);
      }
    }

    async function fetchBundledCss(cssText, resourceUrl, cssMap) {
      try {
        const styleSheet = parseCss_1(cssText);
        const promises = [];
        for (const rule of Array.from(styleSheet.cssRules)) {
          if (rule instanceof CSSImportRule) {
            promises.push(
              (async () => {
                const nestedUrl = absolutizeUrl_1(rule.href, resourceUrl);
                const cssText = await fetchCss(nestedUrl);
                cssMap[nestedUrl] = cssText;
                if (cssText !== undefined) {
                  await fetchBundledCss(cssText, nestedUrl, cssMap);
                }
              })(),
            );
          }
        }
        await Promise.all(promises);
      } catch (ex) {
        console.log(`error during fetchBundledCss, resourceUrl=${resourceUrl}`, ex);
      }
    }

    function doFetchAllCssFromFrame(frameDoc, baseUrl, cssMap, promises) {
      fetchAllCssFromNode(frameDoc.documentElement);

      function fetchAllCssFromNode(node) {
        promises.push(fetchNodeCss(node, baseUrl, cssMap));

        switch (node.nodeType) {
          case NODE_TYPES$1.ELEMENT: {
            const tagName = node.tagName.toUpperCase();
            if (tagName === 'IFRAME') {
              return fetchAllCssFromIframe(node);
            } else {
              return fetchAllCssFromElement(node);
            }
          }
        }
      }

      async function fetchAllCssFromElement(el) {
        Array.prototype.map.call(el.childNodes, fetchAllCssFromNode);
      }

      async function fetchAllCssFromIframe(el) {
        fetchAllCssFromElement(el);
        if (!el.contentDocument) {
          return;
        }
        try {
          const baseUrl = isInlineFrame_1(el) ? el.baseURI : el.contentDocument.location.href;
          doFetchAllCssFromFrame(el.contentDocument, baseUrl, cssMap, promises);
        } catch (ex) {
          console.log(ex);
        }
      }
    }
  };
}

var prefetchAllCss = makePrefetchAllCss;

const {NODE_TYPES: NODE_TYPES$2} = nodeTypes;

const API_VERSION = '1.3.0';

async function captureFrame(
  {styleProps, rectProps, ignoredTagNames} = defaultDomProps,
  doc = document,
  addStats = false,
  fetchTimeLimit = 30000,
) {
  const performance = {total: {}, prefetchCss: {}, doCaptureDoc: {}, waitForImages: {}};
  function startTime(obj) {
    obj.startTime = Date.now();
  }
  function endTime(obj) {
    obj.endTime = Date.now();
    obj.elapsedTime = obj.endTime - obj.startTime;
  }
  const promises = [];
  startTime(performance.total);
  const unfetchedResources = new Set();
  const iframeCors = [];
  const iframeToken = '@@@@@';
  const unfetchedToken = '#####';
  const separator = '-----';

  startTime(performance.prefetchCss);
  const prefetchAllCss$$1 = prefetchAllCss(fetchCss(fetch, {fetchTimeLimit}));
  const getCssFromCache = await prefetchAllCss$$1(doc);
  endTime(performance.prefetchCss);

  const getBundledCssFromCssText$$1 = getBundledCssFromCssText({
    parseCss: parseCss_1,
    CSSImportRule,
    getCssFromCache,
    absolutizeUrl: absolutizeUrl_1,
    unfetchedToken,
  });
  const extractCssFromNode$$1 = extractCssFromNode({getCssFromCache, absolutizeUrl: absolutizeUrl_1});
  const captureNodeCss$$1 = captureNodeCss({
    extractCssFromNode: extractCssFromNode$$1,
    getBundledCssFromCssText: getBundledCssFromCssText$$1,
    unfetchedToken,
  });

  startTime(performance.doCaptureDoc);
  const capturedFrame = doCaptureDoc(doc);
  endTime(performance.doCaptureDoc);

  startTime(performance.waitForImages);
  await Promise.all(promises);
  endTime(performance.waitForImages);

  // Note: Change the API_VERSION when changing json structure.
  capturedFrame.version = API_VERSION;
  capturedFrame.scriptVersion = '7.2.6';

  const iframePrefix = iframeCors.length ? `${iframeCors.join('\n')}\n` : '';
  const unfetchedPrefix = unfetchedResources.size
    ? `${Array.from(unfetchedResources).join('\n')}\n`
    : '';
  const metaPrefix = JSON.stringify({
    separator,
    cssStartToken: unfetchedToken,
    cssEndToken: unfetchedToken,
    iframeStartToken: `"${iframeToken}`,
    iframeEndToken: `${iframeToken}"`,
  });

  endTime(performance.total);

  function stats() {
    if (!addStats) {
      return '';
    }
    return `\n${separator}\n${JSON.stringify(performance)}`;
  }

  const ret = `${metaPrefix}\n${unfetchedPrefix}${separator}\n${iframePrefix}${separator}\n${JSON.stringify(
    capturedFrame,
  )}${stats()}`;
  console.log('[captureFrame]', JSON.stringify(performance));
  return ret;

  function notEmptyObj(obj) {
    return Object.keys(obj).length ? obj : undefined;
  }

  function captureTextNode(node) {
    return {
      tagName: '#text',
      text: node.textContent,
    };
  }

  function doCaptureDoc(docFrag, baseUrl = docFrag.location && docFrag.location.href) {
    const bgImages = new Set();
    let bundledCss = '';
    const ret = captureNode(docFrag.documentElement || docFrag);
    ret.css = bundledCss;
    promises.push(getImageSizes_1({bgImages}).then(images => (ret.images = images)));
    return ret;

    function captureNode(node) {
      const {bundledCss: nodeCss, unfetchedResources: nodeUnfetched} = captureNodeCss$$1(
        node,
        baseUrl,
      );
      bundledCss += nodeCss;
      if (nodeUnfetched) for (const elem of nodeUnfetched) unfetchedResources.add(elem);

      switch (node.nodeType) {
        case NODE_TYPES$2.TEXT: {
          return captureTextNode(node);
        }
        case NODE_TYPES$2.ELEMENT: {
          const tagName = node.tagName.toUpperCase();
          if (tagName === 'IFRAME') {
            return iframeToJSON(node);
          } else {
            return elementToJSON(node);
          }
        }
        case NODE_TYPES$2.DOCUMENT_FRAGMENT: {
          return {
            childNodes: Array.prototype.map.call(node.childNodes, captureNode).filter(Boolean),
          };
        }
        default: {
          return null;
        }
      }
    }

    function elementToJSON(el) {
      const childNodes = Array.prototype.map.call(el.childNodes, captureNode).filter(Boolean);
      const shadowRoot = el.shadowRoot && doCaptureDoc(el.shadowRoot, baseUrl);

      const tagName = el.tagName.toUpperCase();
      if (ignoredTagNames.indexOf(tagName) > -1) return null;

      const computedStyle = window.getComputedStyle(el);
      const boundingClientRect = el.getBoundingClientRect();

      const style = {};
      for (const p of styleProps) style[p] = computedStyle.getPropertyValue(p);
      if (!style['border-width']) {
        style['border-width'] = `${computedStyle.getPropertyValue(
          'border-top-width',
        )} ${computedStyle.getPropertyValue('border-right-width')} ${computedStyle.getPropertyValue(
          'border-bottom-width',
        )} ${computedStyle.getPropertyValue('border-left-width')}`;
      }

      const rect = {};
      for (const p of rectProps) rect[p] = boundingClientRect[p];

      const attributes = Array.from(el.attributes)
        .map(a => ({key: a.name, value: a.value}))
        .reduce((obj, attr) => {
          obj[attr.key] = attr.value;
          return obj;
        }, {});

      const bgImage = getBackgroundImageUrl_1(computedStyle.getPropertyValue('background-image'));
      if (bgImage) {
        bgImages.add(bgImage);
      }

      const result = {
        tagName,
        style: notEmptyObj(style),
        rect: notEmptyObj(rect),
        attributes: notEmptyObj(attributes),
        childNodes,
      };
      if (shadowRoot) {
        result.shadowRoot = shadowRoot;
      }
      return result;
    }

    function iframeToJSON(el) {
      const obj = elementToJSON(el);
      let doc;
      try {
        doc = el.contentDocument;
      } catch (ex) {
        markFrameAsCors();
        return obj;
      }
      try {
        if (doc) {
          obj.childNodes = [doCaptureDoc(doc, isInlineFrame_1(el) ? el.baseURI : doc.location.href)];
        } else {
          markFrameAsCors();
        }
      } catch (ex) {
        console.log('error in iframeToJSON', ex);
      }
      return obj;

      function markFrameAsCors() {
        const xpath = genXpath_1(el);
        iframeCors.push(xpath);
        obj.childNodes = [`${iframeToken}${xpath}${iframeToken}`];
      }
    }
  }
}

var captureFrame_1 = captureFrame;

module.exports = captureFrame_1;
