/* globals describe,it,cy,before,after */
describe('applitools.com', () => {
  before(() => {
    cy.eyesOpen({
      showLogs: true,
      appName: 'cypress play around',
      testName: 'cypress play around',
      viewportSize: [
        // {width: 800, height: 600},
        {width: 1024, height: 768},
      ],
    });
  });

  after(() => {
    cy.eyesClose();
  });
  it('resources page', () => {
    cy.visit('https://applitools-test.herokuapp.com/resources');
    cy.eyesCheckWindow('first');
  });
});
