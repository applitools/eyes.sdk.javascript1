'use strict';

function createPagePool({initPage, logger}) {
  let counter = 0;
  const fullPageObjs = [];
  logger.log(`[page pool] created`);
  let currWaitOnFreePage = Promise.resolve();
  const pagePool = {
    getFreePage,
    createPage: async () => {
      const fullPageObj = await createPage();
      fullPageObjs.push(fullPageObj);
      return toSmallPageObj(fullPageObj);
    },
    addToPool: pageId => {
      const fullPageObj = fullPageObjs.find(p => p.pageId === pageId);
      if (fullPageObj) {
        fullPageObj.addToPool();
      }
    },
    removePage: pageId => {
      const fullPageObj = fullPageObjs.find(p => p.pageId === pageId);
      if (fullPageObj) {
        fullPageObj.removePage();
      }
    },
    isInPool: pageId => {
      const fullPageObj = fullPageObjs.find(p => p.pageId === pageId);
      return fullPageObj && fullPageObj.isInPool();
    },
  };

  return pagePool;

  async function getFreePage() {
    logger.log(`[page pool] waiting for free page`);
    await currWaitOnFreePage;
    currWaitOnFreePage = Promise.race(
      fullPageObjs
        .filter(p => p.isInPool())
        .map(async p => {
          await p.waitUntilFree();
          return p;
        }),
    );
    const fullPageObj = await currWaitOnFreePage;
    fullPageObj.occupyPage();
    logger.log(`[page pool] free page found: ${fullPageObj.pageId}`);
    return toSmallPageObj(fullPageObj);
  }

  async function createPage() {
    const pageId = counter++;
    let workPromise = Promise.resolve();
    let resolveWork;
    let isActive;
    let createdAt;
    const page = await initPage({pageId, pagePool});
    return {
      page,
      pageId,
      markPageAsFree,
      waitUntilFree,
      occupyPage,
      removePage,
      isInPool,
      addToPool,
      getCreatedAt,
    };

    function markPageAsFree() {
      resolveWork();
    }

    async function waitUntilFree() {
      await workPromise;
    }

    function occupyPage() {
      workPromise = new Promise(resolve => {
        resolveWork = resolve;
      });
    }

    function removePage() {
      fullPageObjs.splice(
        fullPageObjs.findIndex(p => p.pageId === pageId),
        1,
      );
    }

    function isInPool() {
      return isActive;
    }

    function addToPool() {
      isActive = true;
      createdAt = Date.now();
    }

    function getCreatedAt() {
      return createdAt;
    }
  }

  function toSmallPageObj({page, pageId, markPageAsFree, removePage, getCreatedAt}) {
    return {page, pageId, markPageAsFree, removePage, getCreatedAt};
  }
}

module.exports = createPagePool;
