/* global cy */
describe('JS layout', () => {
  it('should support js layouts in open', () => {
    cy.visit('https://applitools.github.io/demo/TestPages/JsLayout/');
    cy.eyesOpen({
      appName: 'JS layout',
      testName: 'testing js layout support in cypress',
      browser: [
        {width: 1000, height: 800},
        {iosDeviceInfo: {deviceName: 'iPad (7th generation)'}},
        {chromeEmulationInfo: {deviceName: 'Pixel 4 XL'}},
      ],
      layoutBreakpoints: [500, 1000],
    });
    cy.eyesCheckWindow('layoutBreakpoints in eyesOpen');
    cy.eyesClose();
  });

  it('should support js layouts in check', () => {
    cy.visit('https://applitools.github.io/demo/TestPages/JsLayout/');
    cy.eyesOpen({
      appName: 'JS layout',
      testName: 'testing js layout support in cypress',
      browser: [
        {name: 'chrome', width: 1000, height: 800},
        {iosDeviceInfo: {deviceName: 'iPad (7th generation)'}},
        {chromeEmulationInfo: {deviceName: 'Pixel 4 XL'}},
      ],
    });
    cy.eyesCheckWindow({
      tag: 'layoutBreakpoints in eyesCheckWindow',
      layoutBreakpoints: [500, 1000],
    });
    cy.eyesClose();
  });

  it('should support js layouts = true', () => {
    cy.visit('https://applitools.github.io/demo/TestPages/JsLayout/');
    cy.eyesOpen({
      appName: 'JS layout',
      testName: 'testing js layout support in cypress',
      browser: [
        {name: 'chrome', width: 1000, height: 800},
        {iosDeviceInfo: {deviceName: 'iPad (7th generation)'}},
        {chromeEmulationInfo: {deviceName: 'Pixel 4 XL'}},
      ],
      layoutBreakpoints: true,
    });
    cy.eyesCheckWindow('layoutBreakpoints = true');
    cy.eyesClose();
  });

  it('should not hit the cypress default command timeout', () => {
    cy.visit('http://localhost:5555/breakpoints.html');
    cy.eyesOpen({
      appName: 'JS layout',
      testName: 'testing js layout support in cypress',
      browser: [
        {name: 'chrome', width: 1000, height: 800},
        {iosDeviceInfo: {deviceName: 'iPad (7th generation)'}},
        {chromeEmulationInfo: {deviceName: 'Pixel 4 XL'}},
      ],
      layoutBreakpoints: true,
    });
    cy.eyesCheckWindow('cypress default command timeout');
    cy.eyesClose();
  });
});
