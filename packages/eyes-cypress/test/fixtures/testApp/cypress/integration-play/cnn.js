/* globals describe,it,cy */
describe('cnn', () => {
  it('cnn works', () => {
    cy.visit('https://cnn.com');

    cy.eyesOpen({
      showLogs: true,
      appName: 'cypress play around',
      testName: 'cypress play around',
      viewportSize: [
        // {width: 800, height: 600},
        {width: 1024, height: 768},
      ],
    });

    cy.eyesCheckWindow('first'); // visual snapshot

    cy.eyesClose();
  });
});
