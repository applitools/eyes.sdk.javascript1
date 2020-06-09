describe('Hello world', () => {

  // This also tests the override of `testName`
  
  it('shows how to use Applitools Eyes with Cypress', () => {
    cy.visit('https://applitools.com/helloworld');
    cy.eyesOpen({
      appName: 'Hello World!',
      testName: 'My first JavaScript test!',
      browser: { width: 800, height: 600 },
      // showLogs: true
    });
    cy.eyesCheckWindow('Main Page');
    cy.get('button').click();
    cy.eyesCheckWindow('Click!');
    cy.eyesClose();

  });
});