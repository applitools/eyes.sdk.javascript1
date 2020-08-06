const {JSDOM, ResourceLoader} = require('jsdom');

/*
This is needed to avoid errors in the console with JSDOM. The tests still pass without it, but it creates noise and a false sense of failure.
*/
class CustomResourceLoader extends ResourceLoader {
  async fetch(url, options) {
    if (process.env.APPLITOOLS_SHOW_LOGS) console.log('[jsdom resource]', url);
    if (/\.css$/.test(url)) {
      return Buffer.from('');
    }
    if (options.element.constructor.name === 'HTMLLinkElement' && url === 'javascript:void(0)') {
      return Buffer.from('');
    }
  }
}

function getDocNode(htmlStr) {
  const resourceLoader = new CustomResourceLoader();
  const dom = new JSDOM(htmlStr, {url: 'http://something.org/', resources: resourceLoader});
  return dom.window.document;
}

module.exports = getDocNode;
