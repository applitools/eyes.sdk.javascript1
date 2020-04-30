'use strict';
const defaultDomProps = require('./defaultDomProps');
const getBackgroundImageUrl = require('./getBackgroundImageUrl');
const getImageSizes = require('./getImageSizes');
const genXpath = require('./genXpath');
const isInlineFrame = require('./isInlineFrame');
const absolutizeUrl = require('./absolutizeUrl');
const makeGetBundledCssFromCssText = require('./getBundledCssFromCssText');
const parseCss = require('./parseCss');
const makeFetchCss = require('./fetchCss');
const makeExtractCssFromNode = require('./extractCssFromNode');
const makeCaptureNodeCss = require('./captureNodeCss');
const makePrefetchAllCss = require('./prefetchAllCss');
const {NODE_TYPES} = require('./nodeTypes');

const API_VERSION = '1.2.0';

async function captureFrame(
  {styleProps, rectProps, ignoredTagNames} = defaultDomProps,
  doc = document,
  addStats = false,
  fetchTimeLimit = 30000,
) {
  const performance = {total: {}, prefetchCss: {}, doCaptureFrame: {}, waitForImages: {}};
  function startTime(obj) {
    obj.startTime = Date.now();
  }
  function endTime(obj) {
    obj.endTime = Date.now();
    obj.ellapsedTime = obj.endTime - obj.startTime;
  }
  const promises = [];
  startTime(performance.total);
  const unfetchedResources = new Set();
  const iframeCors = [];
  const iframeToken = '@@@@@';
  const unfetchedToken = '#####';
  const separator = '-----';

  startTime(performance.prefetchCss);
  const prefetchAllCss = makePrefetchAllCss(makeFetchCss(fetch, {fetchTimeLimit}));
  const getCssFromCache = await prefetchAllCss(doc);
  endTime(performance.prefetchCss);

  const getBundledCssFromCssText = makeGetBundledCssFromCssText({
    parseCss,
    CSSImportRule,
    getCssFromCache,
    absolutizeUrl,
    unfetchedToken,
  });
  const extractCssFromNode = makeExtractCssFromNode({getCssFromCache, absolutizeUrl});
  const captureNodeCss = makeCaptureNodeCss({
    extractCssFromNode,
    getBundledCssFromCssText,
    unfetchedToken,
  });

  startTime(performance.doCaptureFrame);
  const capturedFrame = doCaptureFrame(doc);
  endTime(performance.doCaptureFrame);

  startTime(performance.waitForImages);
  await Promise.all(promises);
  endTime(performance.waitForImages);

  // Note: Change the API_VERSION when changing json structure.
  capturedFrame.version = API_VERSION;
  capturedFrame.scriptVersion = 'DOM_CAPTURE_SCRIPT_VERSION_TO_BE_REPLACED';

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

  function filter(x) {
    return !!x;
  }

  function notEmptyObj(obj) {
    return Object.keys(obj).length ? obj : undefined;
  }

  function captureTextNode(node) {
    return {
      tagName: '#text',
      text: node.textContent,
    };
  }

  function doCaptureFrame(frameDoc, baseUrl = frameDoc.location.href) {
    const bgImages = new Set();
    let bundledCss = '';
    const ret = captureNode(frameDoc.documentElement);
    ret.css = bundledCss;
    promises.push(getImageSizes({bgImages}).then(images => (ret.images = images)));
    return ret;

    function captureNode(node) {
      const {bundledCss: nodeCss, unfetchedResources: nodeUnfetched} = captureNodeCss(
        node,
        baseUrl,
      );
      bundledCss += nodeCss;
      if (nodeUnfetched) for (const elem of nodeUnfetched) unfetchedResources.add(elem);

      switch (node.nodeType) {
        case NODE_TYPES.TEXT: {
          return captureTextNode(node);
        }
        case NODE_TYPES.ELEMENT: {
          const tagName = node.tagName.toUpperCase();
          if (tagName === 'IFRAME') {
            return iframeToJSON(node);
          } else {
            return elementToJSON(node);
          }
        }
        default: {
          return null;
        }
      }
    }

    function elementToJSON(el) {
      const childNodes = Array.prototype.map.call(el.childNodes, captureNode).filter(filter);

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

      const bgImage = getBackgroundImageUrl(computedStyle.getPropertyValue('background-image'));
      if (bgImage) {
        bgImages.add(bgImage);
      }

      return {
        tagName,
        style: notEmptyObj(style),
        rect: notEmptyObj(rect),
        attributes: notEmptyObj(attributes),
        childNodes,
      };
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
          obj.childNodes = [
            doCaptureFrame(doc, isInlineFrame(el) ? el.baseURI : doc.location.href),
          ];
        } else {
          markFrameAsCors();
        }
      } catch (ex) {
        console.log('error in iframeToJSON', ex);
      }
      return obj;

      function markFrameAsCors() {
        const xpath = genXpath(el);
        iframeCors.push(xpath);
        obj.childNodes = [`${iframeToken}${xpath}${iframeToken}`];
      }
    }
  }
}

module.exports = captureFrame;
