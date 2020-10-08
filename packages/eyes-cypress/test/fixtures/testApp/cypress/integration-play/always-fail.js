/* globals describe,it,cy,Cypress */
describe('second-test-fails', () => {
  it('second-test-fails', () => {
    const url = `http://localhost:${Cypress.config('testPort')}/fail-baseline.html`;
    cy.visit(url);
    cy.eyesOpen({
      appName: 'failing app',
    });
    cy.eyesCheckWindow();
    cy.eyesClose();
  });
});

describe('second-test-fails', () => {
  it('second-test-fails', () => {
    const url = `http://localhost:${Cypress.config('testPort')}/fail.html`;
    cy.visit(url);
    cy.eyesOpen({
      appName: 'failing app',
    });
    cy.eyesCheckWindow();
    cy.eyesClose();
  });
});
