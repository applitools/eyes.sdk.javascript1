const GET_SCROLL_OFFSET_FUNC = `
  function getScrollOffset(element) {
    if (element) {
      return {x: element.scrollLeft, y: element.scrollTop};
    } else {
      return {
        x: window.scrollX || window.pageXOffset,
        y: window.scrollY || window.pageYOffset,
      }
    }
  }
`

const TRANSFORM_KEYS = ['transform', '-webkit-transform']

const GET_TRANSLATE_OFFSET_FUNC = `
  function getTranslateOffset(element = document.documentElement) {
    var translates = [${TRANSFORM_KEYS.map(key => `element.style['${key}']`).join(',')}]
      .reduce(function(translates, transform) {
        if (transform) {
          var data = transform.match(/^translate\\(\\s*(\\-?[\\d, \\.]+)px,\\s*(\-?[\\d, \\.]+)px\\s*\\)/);
          if (!data) {
            throw new Error(\`Can't parse CSS transition: \${transform}!\`);
          }
          translates.push({
            x: Math.round(-parseFloat(data[1])),
            y: Math.round(-parseFloat(data[2]))
          });
        }
        return translates;
      }, []);
    if (translates.some(function(offset) { return translates[0].x !== offset.x || translates[0].y !== offset.y })) {
      throw new Error('Got different css positions!');
    }
    return translates[0] || {x: 0, y: 0};
  }
`

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

const GET_FIXED_ANCESTOR_FUNC = `
  function getFixedAncestor(element) {
    var offsetElement = element;
    while (
      offsetElement.offsetParent &&
      offsetElement.offsetParent !== document.body &&
      offsetElement.offsetParent !== document.documentElement
    ) {
      offsetElement = offsetElement.offsetParent;
    }
    var position = window.getComputedStyle(offsetElement).getPropertyValue('position');
    return position === 'fixed' ? offsetElement : null
  }
`

const GET_OFFSET_FROM_ANCESTOR_FUNCT = `
  ${GET_SCROLL_OFFSET_FUNC}
  function getOffsetFromAncestor(element, ancestorElement) {
    const ancestorRect = ancestorElement.getBoundingClientRect();
    const ancestorScrollOffset = getScrollOffset(ancestorElement);
    const elementRect = element.getBoundingClientRect();
    return {
      x: elementRect.left - ancestorRect.left + ancestorScrollOffset.x,
      y: elementRect.top - ancestorRect.top + ancestorScrollOffset.y,
    }
  }
`

const IS_SCROLLABLE_ELEMENT_FUNC = `
  function isScrollableElement(element) {
    return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
  }
`

const GET_ELEMENT_RECT = `
  ${GET_FIXED_ANCESTOR_FUNC}
  ${GET_OFFSET_FROM_ANCESTOR_FUNCT}
  ${IS_SCROLLABLE_ELEMENT_FUNC}
  var element = arguments[0];
  var rect = element.getBoundingClientRect();
  var computedStyle = window.getComputedStyle(element);
  var fixedElement = getFixedAncestor(element);
  var fixedElementRect = fixedElement ? fixedElement.getBoundingClientRect() : null
  var offsetFromFixedElement = fixedElement ? getOffsetFromAncestor(element, fixedElement) : null
  var isFixedElementScrollable = fixedElement ? isScrollableElement(fixedElement) : null
  return {
    x: fixedElement
      ? (fixedElement !== element && isFixedElementScrollable ? offsetFromFixedElement.x + fixedElementRect.left : rect.left)
      : rect.left + (window.scrollX || window.pageXOffset),
    y: fixedElement
      ? (fixedElement !== element && isFixedElementScrollable ? offsetFromFixedElement.y + fixedElementRect.top : rect.top)
      : rect.top + (window.scrollY || window.pageYOffset),
    width: rect.width,
    height: rect.height
  };
`

const GET_ELEMENT_CLIENT_RECT = `
  ${GET_FIXED_ANCESTOR_FUNC}
  ${IS_SCROLLABLE_ELEMENT_FUNC}
  var element = arguments[0];
  var rect = element.getBoundingClientRect();
  var computedStyle = window.getComputedStyle(element);
  var borderLeftWidth = parseInt(computedStyle.getPropertyValue('border-left-width'));
  var borderTopWidth = parseInt(computedStyle.getPropertyValue('border-top-width'));
  var fixedElement = getFixedAncestor(element);
  var isFixedElementScrollable = fixedElement ? isScrollableElement(fixedElement) : false
  var fixedElementRect = fixedElement && fixedElement !== element ? fixedElement.getBoundingClientRect() : null
  return {
    x: (fixedElement
      ? (fixedElement !== element && isFixedElementScrollable ? element.offsetLeft + fixedElementRect.left : rect.left)
      : rect.left + (window.scrollX || window.pageXOffset)
    ) + borderLeftWidth,
    y: (fixedElement
      ? (fixedElement !== element && isFixedElementScrollable ? element.offsetTop + fixedElementRect.top : rect.top)
      : rect.top + (window.scrollY || window.pageYOffset)
    ) + borderTopWidth,
    width: element.clientWidth,
    height: element.clientHeight
  };
`

const GET_ELEMENT_PROPERTIES = `
  var properties = arguments[0];
  var element = arguments[1];
  return properties.map(function(property) { return element[property]; });
`

const GET_ELEMENT_CSS_PROPERTIES = `
  var properties = arguments[0];
  var element = arguments[1];
  var computedStyle = window.getComputedStyle(element, null);
  return computedStyle
    ? properties.map(function(property) { return computedStyle.getPropertyValue(property); })
    : [];
`

const GET_INNER_OFFSETS = `
  ${GET_SCROLL_OFFSET_FUNC}
  ${GET_TRANSLATE_OFFSET_FUNC}
  return {
    scroll: getScrollOffset(arguments[0]),
    translate: getTranslateOffset(arguments[0])
  }
`

const GET_SCROLL_POSITION = `
  var element = arguments[0];
  if (element) return [element.scrollLeft, element.scrollTop];
  else {
    var doc = document.documentElement;
    return [
      window.scrollX || ((window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)),
      window.scrollY || ((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0))
    ];
  }
`

const SCROLL_TO = `
  var offset = arguments[0];
  var element = arguments[1] || document.documentElement;
  if (element.scrollTo) {
    element.scrollTo(offset.x, offset.y);
  } else {
    element.scrollTop = offset.x;
    element.scrollLeft = offset.y;
  }
  return [element.scrollLeft, element.scrollTop];
`

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
  ${TRANSFORM_KEYS.map(key => `element.style['${key}'] = 'translate(${-x}px, ${-y}px)'`).join(';')}
`

const IS_SCROLLABLE = `
  var element = arguments[0] || document.documentElement;
  return element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight
`

const MARK_SCROLL_ROOT_ELEMENT = `
  var element =  arguments[0] || document.documentElement;
  element.setAttribute("data-applitools-scroll", "true");
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

const BLUR_ELEMENT = `
  var activeElement = arguments[0] || document.activeElement;
  if (activeElement) activeElement.blur();
  return activeElement;
`

const FOCUS_ELEMENT = `
  var activeElement = arguments[0];
  if (activeElement) activeElement.focus();
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
  var isCORS, isRoot, selector;
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
      selector = getElementXpath(window.frameElement);
    } catch (err) {
      selector = null;
    }
  }
  return {
    isRoot: isRoot,
    isCORS: isCORS,
    contentDocument: document.querySelector('html'),
    selector: selector,
  };
`

const GET_FRAME_BY_NAME_OR_ID = `
  var nameOrId = arguments[0];
  try {
    return document.querySelector('iframe[name="' + nameOrId + '"],iframe#' + nameOrId);
  } catch (err) {
    return null;
  }
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

const GET_DOCUMENT_ELEMENT = `
  return document.documentElement
`

module.exports = {
  GET_VIEWPORT_SIZE,
  GET_CONTENT_ENTIRE_SIZE,
  GET_ELEMENT_ENTIRE_SIZE,
  GET_ELEMENT_RECT,
  GET_ELEMENT_CLIENT_RECT,
  GET_ELEMENT_CSS_PROPERTIES,
  GET_ELEMENT_PROPERTIES,
  GET_INNER_OFFSETS,
  GET_SCROLL_POSITION,
  SCROLL_TO,
  GET_TRANSFORMS,
  SET_TRANSFORMS,
  TRANSLATE_TO,
  IS_SCROLLABLE,
  MARK_SCROLL_ROOT_ELEMENT,
  GET_OVERFLOW,
  SET_OVERFLOW_AND_RETURN_ORIGIN_VALUE,
  BLUR_ELEMENT,
  FOCUS_ELEMENT,
  GET_ELEMENT_XPATH,
  GET_ELEMENT_ABSOLUTE_XPATH,
  GET_CURRENT_CONTEXT_INFO,
  GET_FRAME_BY_NAME_OR_ID,
  GET_FRAMES,
  GET_DOCUMENT_ELEMENT,
}
