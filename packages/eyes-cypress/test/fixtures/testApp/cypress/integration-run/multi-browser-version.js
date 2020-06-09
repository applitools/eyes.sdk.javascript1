describe('eyes-cypress', () => {

  /*
  NOTE: this test intentionally embeds the browser version into the test name. This is because of the "ping-pong problem":
  2 browser versions share the same baseline. If there are visual differences between them, then one of them will be unresolved, and after
  accepting the change in the dashboard, the other will be unresolved.
  By embeding the browser version we avoid this issue, because every version will have its own baseline. But there's a price - every time there's
  a browser version shift, we get a new baseline. So the test may lack coverage.
  Eyes server should implement logic to make the browser version number part of the baseline, but if a version is missing a baseline - find a
  baseline from a previous version of the same browser. Then, if the user saves a new baseline, save it under the new version, so in subsequent
  runs the baseline for the new version would be found.
  */

  const browsers = [
    {width: 1024, height: 768, name: 'chrome-one-version-back'},
    {width: 1024, height: 768, name: 'chrome-two-versions-back'},
    {width: 1024, height: 768, name: 'firefox-one-version-back'},
    {width: 1024, height: 768, name: 'firefox-two-versions-back'},
    {width: 1024, height: 768, name: 'safari-one-version-back'},
    {width: 1024, height: 768, name: 'safari-two-versions-back'},
  ];

  browsers.forEach(browser => {
    it(`multi browser version: ${browser.name}`, () => {
      cy.setCookie('auth', 'secret');
      const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
      cy.visit(url);
      cy.eyesOpen({
        appName: 'some app',
        browser
        // showLogs: true,
      });
      cy.eyesCheckWindow();
      cy.eyesClose();
    });
  })
});
