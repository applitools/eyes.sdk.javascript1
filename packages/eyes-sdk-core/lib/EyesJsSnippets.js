const GET_VIEWPORT_SIZE =
  'var height, width; ' +
  'if (window.innerHeight) { height = window.innerHeight; } ' +
  'else if (document.documentElement && document.documentElement.clientHeight) { height = document.documentElement.clientHeight; } ' +
  'else { var b = document.getElementsByTagName("body")[0]; if (b.clientHeight) {height = b.clientHeight;} }; ' +
  'if (window.innerWidth) { width = window.innerWidth; } ' +
  'else if (document.documentElement && document.documentElement.clientWidth) { width = document.documentElement.clientWidth; } ' +
  'else { var b = document.getElementsByTagName("body")[0]; if (b.clientWidth) { width = b.clientWidth;} }; ' +
  'return [width, height];'

const GET_CONTENT_ENTIRE_SIZE = `
  var scrollWidth = document.documentElement.scrollWidth;
  var bodyScrollWidth = document.body.scrollWidth;
  var totalWidth = Math.max(scrollWidth, bodyScrollWidth);
  var clientHeight = document.documentElement.clientHeight;
  var bodyClientHeight = document.body.clientHeight;
  var scrollHeight = document.documentElement.scrollHeight;
  var bodyScrollHeight = document.body.scrollHeight;
  var maxDocElementHeight = Math.max(clientHeight, scrollHeight);
  var maxBodyHeight = Math.max(bodyClientHeight, bodyScrollHeight);
  var totalHeight = Math.max(maxDocElementHeight, maxBodyHeight);
  return [totalWidth, totalHeight];
`

const GET_ELEMENT_ENTIRE_SIZE = `
  var element = arguments[0];
  return [
    Math.max(element.clientWidth, element.scrollWidth),
    Math.max(element.clientHeight, element.scrollHeight)
  ];
`

const GET_SCROLL_POSITION = `
  var element = arguments[0] || document.scrollingElement;
  if (element) return [element.scrollLeft, element.scrollTop];
  else {
    var doc = document.documentElement;
    return [
      window.scrollX || ((window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)),
      window.scrollY || ((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0))
    ];
  }
`

const SCROLL_TO = (x, y) => `
  var element = arguments[0] || document.scrollingElement || window;
  element.scrollTo(${x}, ${y});
`

const TRANSFORM_KEYS = ['transform', '-webkit-transform']

const GET_TRANSFORMS = `
  var element = arguments[0] || document.documentElement;
  return {${TRANSFORM_KEYS.map(key => `['${key}']: element.style['${key}']`).join(',')}};
`

const SET_TRANSFORMS = transforms => `
  var element = arguments[0] || document.documentElement;
  ${Object.entries(transforms)
    .map(([key, value]) => `element.style['${key}'] = '${value}'`)
    .join(';')}
`

const TRANSLATE_TO = (x, y) => `
  var element = arguments[0] || document.documentElement;
  element.scrollTo(0, 0);
  ${TRANSFORM_KEYS.map(key => `element.style['${key}'] = 'translate(10px, -${y}px)'`).join(';')}
  ${TRANSFORM_KEYS.map(key => `element.style['${key}'] = 'translate(-${x}px, -${y}px)'`).join(';')}
`

const GET_OVERFLOW = `
  var el = arguments[0];
  return el.style.overflow;
`

const SET_OVERFLOW_AND_RETURN_ORIGIN_VALUE = overflow => `
  var el = arguments[0]; var origOverflow = el.style.overflow; var newOverflow = '${overflow}';
  el.style.overflow = newOverflow;
  if (newOverflow.toUpperCase() === 'HIDDEN' && origOverflow.toUpperCase() !== 'HIDDEN') { el.setAttribute('data-applitools-original-overflow', origOverflow); }
  return origOverflow;
`

const GET_ELEMENT_XPATH_FUNC = `
  function getElementXpath(element) {
    var ownerDocument = element.ownerDocument;
    if (!ownerDocument) return ''; // this is the document node
    var xpath = '';
    var targetElement = element
    while (targetElement !== ownerDocument) {
      var index = 1 + Array.prototype
        .filter.call(targetElement.parentNode.childNodes, function(node) {
          return node.tagName === targetElement.tagName;
        })
        .indexOf(targetElement);
      xpath = '/' + targetElement.tagName + '[' + index + ']' + xpath;
      targetElement = targetElement.parentNode;
    }
    return xpath;
  }
`

const GET_ELEMENT_ABSOLUTE_XPATH = `
  ${GET_ELEMENT_XPATH_FUNC}
  function getElementAbsoluteXpath(element) {
    var xpath = getElementXpath(element).slice(1);
    var frameElement = element.ownerDocument.defaultView.frameElement;
    if (frameElement) {
      xpath = getElementAbsoluteXpath(frameElement) + ',' + xpath;
    }
    return xpath;
  }
  return getElementAbsoluteXpath(arguments[0]);
`

const GET_ELEMENT_XPATH = `
  ${GET_ELEMENT_XPATH_FUNC}
  return getElementXpath(arguments[0]);
`

const GET_CURRENT_CONTEXT_INFO = `
  ${GET_ELEMENT_XPATH_FUNC}
  var isCORS, isRoot, frameSelector;
  try {
    isRoot = window.top.document === window.document;
  } catch (err) {
    isRoot = false;
  }
  try {
    isCORS = !window.parent.document === window.document;
  } catch (err) {
    isCORS = true;
  }
  if (!isCORS) {
    try {
      frameSelector = getElementXpath(window.frameElement);
    } catch (err) {
      frameSelector = null;
    }
  }
  return {
    isRoot: isRoot,
    isCORS: isCORS,
    document: document,
    frameSelector: frameSelector,
  };
`

const GET_FRAMES = `
  var frames = document.querySelectorAll('frame, iframe');
  return Array.prototype.map.call(frames, function(frameElement) {
    return {
      isCORS: !frameElement.contentDocument,
      element: frameElement,
      src: frameElement.src
    };
  });
`

module.exports = {
  GET_VIEWPORT_SIZE,
  GET_CONTENT_ENTIRE_SIZE,
  GET_ELEMENT_ENTIRE_SIZE,
  GET_SCROLL_POSITION,
  SCROLL_TO,
  GET_TRANSFORMS,
  SET_TRANSFORMS,
  TRANSLATE_TO,
  GET_OVERFLOW,
  SET_OVERFLOW_AND_RETURN_ORIGIN_VALUE,
  GET_ELEMENT_XPATH,
  GET_ELEMENT_ABSOLUTE_XPATH,
  GET_CURRENT_CONTEXT_INFO,
  GET_FRAMES,
}
