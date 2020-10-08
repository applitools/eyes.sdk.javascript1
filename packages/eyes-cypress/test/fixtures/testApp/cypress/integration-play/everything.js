/* global cy,describe,it,beforeEach,afterEach */
describe('Main suite', () => {
  beforeEach(() => {
    cy.eyesOpen({
      appName: 'website',
      browser: [
        {width: 320, height: 1000},
        {width: 480, height: 1000},
        {width: 768, height: 1000},
        {width: 992, height: 1000},
        {width: 1200, height: 1000},
      ],
      showLogs: true,
      apiKey: process.env.APPLITOOLS_TEST_API_KEY,
      serverUrl: 'https://testeyes.applitools.com',
    });
  });

  it('Everything', () => {
    cy.task('getUrls').then(urls => {
      urls.slice(0, 10).forEach(url => {
        const u = url.replace('https://applitools.com', 'https://applitools-test.herokuapp.com');
        cy.visit(u);
        cy.eyesCheckWindow(u);
      });
    });
  });

  afterEach(() => {
    cy.eyesClose();
  });
});
