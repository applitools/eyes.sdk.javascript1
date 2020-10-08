/* globals describe,it,cy,Cypress */
Cypress.on('uncaught:exception', () => {});

let urls = [
  'https://facebook.com',
  'https://twitter.com',
  'https://wikipedia.org',
  'https://docs.microsoft.com/en-us/',
  'https://applitools.com/features/frontend-development',
  'https://applitools.com/docs/topics/overview.html',
  'https://applitools.com/helloworld',
  'https://docs.cypress.io/api/api/table-of-contents.html',
  'https://docs.approvesimple.com/docs',
  'https://theintercept.com/privacy-policy/',
  'https://www.lidl.com/products?category=OCI1000039&sort=productAtoZ',
  'http://example.com',
  'https://www.autogravity.com/inventory?page=0&query=%7B%22bodyStyles%22%3A%5B%7B%22label%22%3A%22SUV%22%2C%22queryValue%22%3A%22SUV%22%7D%5D%2C%22conditions%22%3A%5B%7B%22label%22%3A%22New%22%2C%22queryValue%22%3A%22NEW%22%7D%5D%2C%22regions%22%3A%5B%7B%22queryValue%22%3A%7B%22lat%22%3A40.755322%2C%22lon%22%3A-73.9932872%2C%22rad%22%3A30%7D%7D%5D%2C%22vehicles%22%3A%5B%7B%22label%22%3A%22Kia+Sorento%22%2C%22queryValue%22%3A%7B%22make%22%3A%7B%22id%22%3A19%7D%2C%22model%22%3A%7B%22id%22%3A646%7D%7D%7D%5D%7D&size=50&sort=dealerRank%2Cdesc',
  'https://www.aetna.com/employers-organizations.html',
  'https://www.getbridge.com/solutions/human-resources',
  'https://www.applitools.com/users/login',
  // 'https://southwest.com',
  'https://www.usaa.com/inet/wc/auto-insurance?wa_ref=pub_global_products_ins_auto',
  'https://applitools-sample-web-app-testkit.surge.sh/page-with-resource.html',
  'https://ous.test.clper.me/app/login',
];

// urls = [];

describe('Sanity', () => {
  urls.forEach(url => {
    it(`Sanity - ${url}`, () => {
      cy.visit(url, {failOnStatusCode: false});
      cy.wait(3000);

      cy.eyesOpen({
        appName: 'SanityWeb',
        testName: `Sanity - ${url}`,
        batchName: `sanity 5`,
        batchId: `tokenizer 5`,
        browser: [{width: 1024, height: 768, name: 'chrome'}],
      });

      cy.eyesCheckWindow({
        tag: 'Sanity Load',
      });

      cy.eyesClose();
    });
  });
});
