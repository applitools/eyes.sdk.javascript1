/* globals describe,it,cy,Cypress */
describe('eyes-cypress', () => {
  // after(() => {
  //   cy.then(() => {
  //     throw new Error('aaa');
  //   });
  // });
  it('simple', () => {
    const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    cy.visit(url);
  });
});
