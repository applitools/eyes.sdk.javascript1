const {NODE_TYPES} = require('./nodeTypes');
const parseCss = require('./parseCss');
const absolutizeUrl = require('./absolutizeUrl');
const getHrefAttr = require('./getHrefAttr');
const isInlineFrame = require('./isInlineFrame');
const isLinkToStyleSheet = require('./isLinkToStyleSheet');

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
        resourceUrl = absolutizeUrl(getHrefAttr(node), baseUrl);
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
        const styleSheet = parseCss(cssText);
        const promises = [];
        for (const rule of Array.from(styleSheet.cssRules)) {
          if (rule instanceof CSSImportRule) {
            promises.push(
              (async () => {
                const nestedUrl = absolutizeUrl(rule.href, resourceUrl);
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
          case NODE_TYPES.ELEMENT: {
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
          const baseUrl = isInlineFrame(el) ? el.baseURI : el.contentDocument.location.href;
          doFetchAllCssFromFrame(el.contentDocument, baseUrl, cssMap, promises);
        } catch (ex) {
          console.log(ex);
        }
      }
    }
  };
}

module.exports = makePrefetchAllCss;
