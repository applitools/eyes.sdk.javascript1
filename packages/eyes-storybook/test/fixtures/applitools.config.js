module.exports = {
  appName: 'Simple storybook',
  batchName: 'Simple storybook',
  storybookConfigDir: 'test/fixtures/appWithStorybook/',
  storybookStaticDir: 'test/fixtures',
  storybookPort: 4567,
  // storybookUrl: 'http://localhost:9001',
  // puppeteerOptions: {headless: false, devtools: true},
  include: ({name}) => !/^\[SKIP\]/.test(name),
  // include: ({name}) => name === 'story 1',
  variations: ({name}) => {
    if (/should also do RTL/.test(name)) {
      return ['rtl'];
    }
  },
  ignoreRegions: [{selector: '.global-ignore-this'}],
  strictRegions: [{selector: '{"x":5,"y":6,"width":7,"height":8}'}],
  floatingRegions: [{selector: '{"x":15,"y":16,"width":17,"height":18}'}],
  layoutRegions: [{selector: '{"x":25,"y":26,"width":27,"height":28}'}],
  contentRegions: [{selector: '{"x":35,"y":36,"width":37,"height":38}'}],
  accessibilityRegions: [{selector: '{"x":45,"y":46,"width":47,"height":48}'}],
  ignoreDisplacements: true,
  properties: [{name: 'some prop', value: 'some value'}],
  // notifyOnCompletion: true,
  // accessibilitySettings: {level: 'AA', version: 'WCAG_2_0'},
  // storybookUrl: 'http://localhost:9001/',
  // concurrency: 100,
  // browser: [{width: 1000, height: 600, name: 'edge'}],
  // tapFilePath: './',
};
