describe('eyes-cypress', () => {
  Cypress.config('eyesTimeout', 100); // this very small timeout should make the test fail

  it('runs', () => {
    const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    cy.visit(url);
    cy.eyesOpen({
      appName: 'some app',
      testName: 'cypress-timeout',
      browser: {width: 1024, height: 768},
      showLogs: true
    });
    cy.eyesCheckWindow();
    cy.eyesClose();
  });
});
