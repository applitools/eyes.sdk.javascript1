/* globals describe,it,cy,beforeEach,afterEach */
describe('Main suite', () => {
  beforeEach(() => {
    cy.eyesOpen({
      appName: 'applitools website',
      browser: {
        deviceName: 'iPhone X',
        screenOrientation: 'landscape',
      },
    });
  });

  it('sitemap', () => {
    return cy.task('getUrls').then(urls => {
      urls.forEach(url => {
        cy.visit(url);
        cy.eyesCheckWindow(url);
      });
    });
  });

  afterEach(() => {
    cy.eyesClose();
  });
});
