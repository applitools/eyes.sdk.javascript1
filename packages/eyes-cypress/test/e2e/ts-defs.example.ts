/// <reference path="../fixtures/testAppCopies/testApp-pack-install/node_modules/@applitools/eyes-cypress/eyes-index.d.ts" />

// no options
cy.eyesOpen();

// VGC options
cy.eyesOpen({appName: 'someName'});

// string
cy.eyesCheckWindow('just string');

// VGC options
cy.eyesCheckWindow({
  tag: 'Play Cypress',
});

cy.eyesClose();
