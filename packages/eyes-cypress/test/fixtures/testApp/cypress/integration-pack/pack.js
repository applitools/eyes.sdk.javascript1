describe('eyes-cypress', () => {

  // This also tests the setting of `testName` in `before`
  
  before(() => {
    cy.eyesOpen({
      appName: 'some app',
      browser: {width: 1024, height: 768},
      showLogs: true
    });
  });

  it('pack', () => {
    cy.setCookie('auth', 'secret');
    const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    cy.visit(url);
    cy.eyesCheckWindow();
    cy.eyesClose();
  });
});
