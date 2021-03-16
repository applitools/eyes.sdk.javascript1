const getClientAPI = require('./getClientAPI');

const DEFAULT_TIMEOUT = 60000;

async function getStories({timeout = DEFAULT_TIMEOUT} = {timeout: DEFAULT_TIMEOUT}) {
  const Stories = {
    _getStoriesV2: () => {
      let categories = getCategoriesV2();
      console.log(`got ${categories.length} categories`);
      let stories = [];

      for (const anchor of categories) {
        verifyOpen(anchor);
        const kind = anchor.textContent;
        const storyEls = Array.from(anchor.nextElementSibling.querySelectorAll('a'));
        console.log('found', storyEls.length, 'stories for category', kind);
        stories = stories.concat(
          storyEls.map(storyEl => ({
            kind,
            name: storyEl.textContent,
          })),
        );
      }

      console.log(stories.map(({kind, name}, i) => `${i + 1}) story kind=${kind}, name=${name}`));

      return stories;

      function verifyOpen(anchor) {
        if (!anchor.nextElementSibling) {
          anchor.click();
        }
      }
    },

    _getStoriesV3: () => {
      let menuItems = getAllMenuItemsV3();
      console.log(`got ${menuItems.length} menu items`);

      let closedMenuItems = getClosedMenus(menuItems);
      console.log(
        `got ${closedMenuItems.length} closed menu items:\n${menuItemsToString(closedMenuItems)}`,
      );

      while (closedMenuItems.length) {
        console.log(`opening ${closedMenuItems.length} closed menu items`);
        openMenus(closedMenuItems);
        menuItems = getAllMenuItemsV3();
        closedMenuItems = getClosedMenus(menuItems);
        console.log(`after opening menus, got ${menuItems.length} menu items`);
        console.log(
          `after opening menus, got ${
            closedMenuItems.length
          } closed menu items:\n${menuItemsToString(closedMenuItems)}`,
        );
      }

      const anchors = Array.from(
        document.querySelectorAll('.Pane.vertical.Pane1 [role="menuitem"] + * a[href]'),
      );
      console.log(`returning ${anchors.length} stories.`);

      return anchors.map((anchor, i) => {
        const url = new URL(anchor.href);
        const kind = url.searchParams.get('selectedKind');
        const name = url.searchParams.get('selectedStory');
        console.log(`${i + 1}) story kind=${kind}, name=${name}`);
        return {
          kind,
          name,
        };
      });

      function getClosedMenus(menuItems) {
        return menuItems.filter(
          menuItem => !menuItem.nextElementSibling || !menuItem.nextElementSibling.children[0],
        );
      }

      function openMenus(menuItems) {
        menuItems.forEach(menuItem => menuItem.click());
      }

      function menuItemsToString(menuItems) {
        return menuItems.map(item => item.textContent).join('\n');
      }
    },
  };

  const clientApi = await waitForClientAPI();

  if (clientApi) {
    console.log(`getting stories from storybook via API. ${clientApi.version}`);
    return getStoriesThroughClientAPI(clientApi);
  } else if (isStoryBookLoading()) {
    return Promise.reject('storybook is loading for too long');
  } else {
    const storybookVersion = getVersion();
    if (storybookVersion) {
      console.log(`getting stories from storybook via scraping. ${storybookVersion}`);
      return Stories[`_getStories${storybookVersion}`]();
    } else {
      return Promise.reject('could not determine storybook version in order to extract stories');
    }
  }

  function getStoriesThroughClientAPI(clientApi) {
    return clientApi.getStories().map((story, index) => {
      const {name, kind, parameters} = story;
      const hasEyesParameters =
        parameters && parameters.eyes && typeof parameters.eyes === 'object';
      let parametersIfSerialized, error;
      try {
        parametersIfSerialized = JSON.parse(JSON.stringify(parameters));
      } catch (e) {
        try {
          if (hasEyesParameters) {
            parametersIfSerialized = JSON.parse(JSON.stringify({eyes: parameters.eyes}));
          }
        } catch (ex) {
          error = `Ignoring parameters for story: "${name} ${kind}" since they are not serilizable. Error: "${e.message}"`;
        }
      }

      if (parametersIfSerialized && hasEyesParameters) {
        for (const prop in parameters.eyes) {
          if (typeof parameters.eyes[prop] === 'function') {
            parametersIfSerialized.eyes[prop] = '__func';
          }
        }
      }

      return {
        isApi: true,
        index,
        name,
        kind,
        parameters: parametersIfSerialized,
        error,
      };
    });
  }

  function getAllMenuItemsV3() {
    return Array.from(document.querySelectorAll('.Pane.vertical.Pane1 [role="menuitem"]'));
  }

  function getCategoriesV2() {
    const ul = document.querySelector('.Pane.vertical.Pane1 ul');
    return ul && Array.from(ul.children).map(li => li.querySelector('a'));
  }

  function getVersion() {
    if (getAllMenuItemsV3().length !== 0) {
      return 'V3';
    } else if (getCategoriesV2()) {
      return 'V2';
    }
  }

  function isStoryBookLoading() {
    return Array.from(document.querySelectorAll('nav.container span')).some(
      s => s.innerText === 'loading story',
    );
  }

  function waitForClientAPI() {
    return ptimeoutWithValue(_waitForClientAPI, timeout, undefined);

    async function _waitForClientAPI() {
      try {
        return getClientAPI();
      } catch (ex) {
        await delay(100);
        return _waitForClientAPI();
      }
    }
  }

  async function delay(time) {
    return new Promise(res => {
      setTimeout(res, time);
    });
  }

  async function ptimeoutWithValue(getPromise, delay, value) {
    let _res, _rej;
    const result = new Promise((res, rej) => ((_res = res), (_rej = rej)));
    const cancel = setTimeout(() => _res(value), delay);
    getPromise()
      .then(v => _res(v))
      .catch(e => _rej(e))
      .finally(() => clearTimeout(cancel));
    return result;
  }
}

module.exports = getStories;
