/* globals describe,it,cy */
describe('eyes-cypress', () => {
  it.skip('runs website', () => {
    cy.visit('http://applitools.com');
    cy.eyesOpen({
      appName: 'some app',
      testName: 'cypress-play',
      browser: [
        {width: 1024, height: 768, name: 'chrome'},
        {width: 800, height: 600, name: 'firefox'},
      ],
      showLogs: true,
    });
    cy.eyesCheckWindow('homepage');
    cy.get('.page .navbar a[href="/customers"]').click();
    cy.eyesCheckWindow('customers page');
    cy.get('a[href="/case-studies/walkme"]').click({force: true});
    cy.eyesCheckWindow('walkme page');
    cy.get('.navbar a[href="/pricing"]').click();
    cy.eyesCheckWindow('pricing page');
    cy.eyesClose();
  });
});
