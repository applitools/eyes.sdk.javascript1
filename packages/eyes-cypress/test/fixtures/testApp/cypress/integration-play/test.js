/* globals describe,it,cy,Cypress,beforeEach,afterEach */
describe('eyes-cypress', () => {
  beforeEach(() => {
    cy.setCookie('auth', 'secret');
    cy.eyesOpen({
      appName: 'some app',
    });
  });
  it('cypress-play-test-1', () => {
    const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    cy.visit(url);
    cy.eyesCheckWindow({
      tag: 'full page',
      scriptHooks: {
        beforeCaptureScreenshot: "document.body.style.backgroundColor = 'gold'",
      },
    });
  });

  it('cypress-play-test-2', () => {
    cy.eyesCheckWindow({tag: 'selector', target: 'region', selector: '.region'});
    cy.get('.absolutely').then($el => {
      const {left, top, width, height} = $el[0].getBoundingClientRect();
      cy.eyesCheckWindow({
        tag: 'region',
        target: 'region',
        region: {left, top, width, height},
      });
    });
  });

  afterEach(() => {
    cy.eyesClose();
  });
});
