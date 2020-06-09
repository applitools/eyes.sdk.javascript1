/* global describe,it,cy */
describe('The Intercept - Staging - Visual Regression - Static Pages', () => {
  it('Visual Regression - Editorial Policies', () => {
    cy.visit('https://theintercept.com/policies/');
    cy.eyesOpen({
      appName: 'The Intercept',
    });
    cy.eyesCheckWindow();
    cy.eyesClose();
  });
});
