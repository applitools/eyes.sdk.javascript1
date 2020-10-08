/* globals describe,it,cy */
describe('eyes-cypress', () => {
  it.skip('hacker news', () => {
    cy.visit('http://news.ycombinator.com');
    cy.eyesOpen({
      appName: 'hacker news',
      testName: 'hacker news',
      browser: [
        {width: 1024, height: 768, name: 'chrome'},
        {width: 800, height: 600, name: 'firefox'},
      ],
      showLogs: true,
    });
    cy.eyesCheckWindow('homepage');
    cy.eyesClose();
  });
});
