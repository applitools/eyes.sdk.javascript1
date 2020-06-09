/* globals describe,it,cy,Cypress */

const url = Cypress.env('url');
const testName = `Cypress Render ${url}`;

describe('Cypress Render', () => {
  it('Cypress Render', () => {
    cy.eyesOpen({
      appName: 'Cypress Render',
      testName: testName,
      browser: [{width: 1024, height: 768, name: 'chrome'}],
    });
    cy.visit(url);
    cy.eyesCheckWindow({tag: 'After Load'});
    cy.eyesClose();
  });
});
