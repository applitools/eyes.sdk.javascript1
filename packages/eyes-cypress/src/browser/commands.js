/* global Cypress,cy,window,before,after,navigator */
'use strict';
const poll = require('./poll');
const makeSend = require('./makeSend');
const processPage = require('@applitools/dom-snapshot/dist/processPageCjs');
const domSnapshotOptions = {dontFetchResources: Cypress.config('eyesDisableBrowserFetching')};
const send = makeSend(Cypress.config('eyesPort'), window.fetch);
const makeSendRequest = require('./sendRequest');
const makeEyesCheckWindow = require('./eyesCheckWindow');
const makeHandleCypressViewport = require('./makeHandleCypressViewport');
const sendRequest = makeSendRequest(send);
const eyesCheckWindow = makeEyesCheckWindow({sendRequest, processPage, domSnapshotOptions});
const handleCypressViewport = makeHandleCypressViewport({cy});

if (!Cypress.config('eyesIsDisabled')) {
  const batchEnd = poll(({timeout}) => {
    return sendRequest({command: 'batchEnd', data: {timeout}});
  });

  before(() => {
    const userAgent = navigator.userAgent;
    const viewport = {
      width: Cypress.config('viewportWidth'),
      height: Cypress.config('viewportHeight'),
    };
    let browser = Cypress.config('eyesBrowser') && JSON.parse(Cypress.config('eyesBrowser'));
    handleCypressViewport(browser).then({timeout: 86400000}, () =>
      sendRequest({command: 'batchStart', data: {viewport, userAgent}}),
    );
  });

  after(() => {
    cy.then({timeout: 86400000}, () => {
      return batchEnd({timeout: Cypress.config('eyesTimeout')}).catch(e => {
        if (
          Cypress.config('eyesFailCypressOnDiff') ||
          Cypress.config('eyesFailCypressOnDiff') === undefined
        ) {
          throw e;
        }
      });
    });
  });
}

let isCurrentTestDisabled;

Cypress.Commands.add('eyesOpen', function(args = {}) {
  Cypress.log({name: 'Eyes: open'});
  const {title: testName} = this.currentTest || this.test;
  if (Cypress.config('eyesIsDisabled') && args.isDisabled === false) {
    throw new Error(
      `Eyes-Cypress is disabled by an env variable or in the applitools.config.js file, but the "${testName}" test was passed isDisabled:false. A single test cannot be enabled when Eyes.Cypress is disabled through the global configuration. Please remove "isDisabled:false" from cy.eyesOpen() for this test, or enable Eyes.Cypress in the global configuration, either by unsetting the APPLITOOLS_IS_DISABLED env var, or by deleting 'isDisabled' from the applitools.config.js file.`,
    );
  }
  isCurrentTestDisabled = Cypress.config('eyesIsDisabled') || args.isDisabled;
  if (isCurrentTestDisabled) return;

  return handleCypressViewport(args.browser).then({timeout: 15000}, () =>
    sendRequest({
      command: 'open',
      data: Object.assign({testName}, args),
    }),
  );
});

Cypress.Commands.add('eyesCheckWindow', args => {
  Cypress.log({name: 'Eyes: check window'});
  if (isCurrentTestDisabled) return;
  return cy.document({log: false}).then({timeout: 60000}, doc => eyesCheckWindow(doc, args));
});

Cypress.Commands.add('eyesClose', () => {
  Cypress.log({name: 'Eyes: close'});
  if (isCurrentTestDisabled) {
    isCurrentTestDisabled = false;
    return;
  }
  return sendRequest({command: 'close'});
});
