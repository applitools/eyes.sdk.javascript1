const {presult} = require('@applitools/functional-commons');
const browserLog = require('./browserLog');

function makeInitPage({iframeUrl, config, browser, logger}) {
  return async function initPage({pageId, pagePool}) {
    logger.log('initializing puppeteer page number ', pageId);
    const page = await browser.newPage();
    if (config.viewportSize) {
      await page.setViewport(config.viewportSize);
      const viewportSize = await getViewportSize(page);
      logger.log(`set viewportSize for page ${pageId}: ${viewportSize}`); // TODO remove
    }
    if (config.showLogs) {
      browserLog({
        page,
        onLog: text => {
          if (text.match(/\[dom-snapshot\]/)) {
            logger.log(`tab ${pageId}: ${text}`);
          }
        },
      });
    }
    page.on('error', async err => {
      logger.log(`Puppeteer error for page ${pageId}:`, err);
      pagePool.removePage(pageId);
      const {pageId} = await pagePool.createPage();
      pagePool.addToPool(pageId);
    });
    page.on('close', async () => {
      if (pagePool.isInPool(pageId)) {
        logger.log(
          `Puppeteer page closed [page ${pageId}] while still in page pool, creating a new one instead`,
        );
        pagePool.removePage(pageId);
        const {pageId} = await pagePool.createPage();
        pagePool.addToPool(pageId);
      }
    });
    const [err] = await presult(page.goto(iframeUrl, {timeout: config.readStoriesTimeout}));
    if (err) {
      logger.log(`error navigating to iframe.html`, err);
      if (pagePool.isInPool(pageId)) {
        throw err;
      }
    }
    return page;
  };
}

// TODO remove
async function getViewportSize(page) {
  return JSON.stringify(
    await page.evaluate(() => ({
      width: window.innerWidth, // eslint-disable-line
      height: window.innerHeight, // eslint-disable-line
    })),
  );
}

module.exports = makeInitPage;
