/* globals describe,it,cy,Cypress,after */
after(() => {
  cy.then(() => {
    throw new Error('aaa');
  });
});
describe('eyes-cypress', () => {
  it('simple', () => {
    const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    cy.visit(url);
  });
});
