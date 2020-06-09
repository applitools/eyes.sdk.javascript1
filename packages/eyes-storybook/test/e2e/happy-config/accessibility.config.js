const path = require('path');

module.exports = {
  appName: 'Accessibility storybook',
  batchName: 'Accessibility storybook',
  storybookConfigDir: path.resolve(__dirname, '../../fixtures/accessibilityStorybook'),
  storybookStaticDir: path.resolve(__dirname, '../../fixtures'),
  accessibilityValidation: {
    level: 'AA',
    guidelinesVersion: 'WCAG_2_0',
  },
};
