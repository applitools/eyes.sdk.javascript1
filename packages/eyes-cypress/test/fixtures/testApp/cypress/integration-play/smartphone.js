/* globals describe,it,cy,beforeEach,afterEach */
describe('Main suite', () => {
  beforeEach(() => {
    cy.eyesOpen({
      appName: 'website',
      testName: 'Smartphone',
      showLogs: true,
    });
  });

  it('Single test', () => {
    return cy.task('getUrls').then(_urls => {
      ['https://en.wikipedia.org/wiki/Smartphone'].forEach(url => {
        try {
          cy.visit(url);
          cy.eyesCheckWindow({
            tag: url,
          });
        } catch (e) {
          console.log(e);
        }
      });
    });
  });

  afterEach(() => {
    cy.eyesClose();
  });
});
