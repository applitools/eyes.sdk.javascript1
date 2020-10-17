/* globals describe,it,cy,context */
describe('eyes-cypress', () => {
  context('Reversim website', () => {
    it('works', () => {
      function verifyCount() {
        cy.get(
          ':nth-child(3) > :nth-child(1) > :nth-child(1) > :nth-child(4) > :nth-child(1)',
        ).then(div => {
          const text = div.text();
          const count = Number(text.replace(/[^\d]/g, ''));
          cy.get('.border-bottom + div > .row').should('have.length', count);
        });
      }

      // cy.visit('http://localhost:3000');
      cy.visit('https://summit2018.reversim.com');
      cy.eyesOpen({
        appName: 'reversim website',
        testName: 'works',
        browser: {width: 1200, height: 800},
        showLogs: true,
      });
      cy.eyesCheckWindow('homepage');
      cy.get(':nth-child(1) > .nav-link').click();
      cy.eyesCheckWindow({tag: 'proposals', sizeMode: 'viewport'});
      verifyCount();
      cy.get('.flex-wrap > :nth-child(1)').click();
      cy.eyesCheckWindow({tag: 'filtered proposals', sizeMode: 'viewport'});
      verifyCount();
      cy.eyesClose();
    });
  });
});
