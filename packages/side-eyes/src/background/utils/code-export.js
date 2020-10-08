// commands

function emitCheckWindow(language, { isVisualGridEnabled } = {}, stepName) {
  switch (language) {
    case 'java-junit':
      return `eyes.check(Target.window().fully()${
        isVisualGridEnabled ? '.beforeRenderScreenshotHook(preRenderHook)' : ''
      }${stepName ? `.withName("${stepName}")` : ''});`
    case 'javascript-mocha':
      if (stepName) return `await eyes.check("${stepName}", Target.window().webHook(preRenderHook).fully(true))`
      else
        return `await eyes.check((new URL(await driver.getCurrentUrl())).pathname, Target.window().webHook(preRenderHook).fully(true))`
    case 'python-pytest':
      if (stepName) return `self.eyes.check("${stepName}", Target.window().fully(True))`
      else return `self.eyes.check(urlparse(self.driver.current_url).path, Target.window().fully(True))`
    case 'ruby-rspec':
      if (stepName)
        return `@eyes.check("${stepName}", Applitools::Selenium::Target.window.fully.script_hook(@pre_render_hook))`
      else
        return `@eyes.check(URI.parse(@driver.current_url).path, Applitools::Selenium::Target.window.fully.script_hook(@pre_render_hook))`
    case 'csharp-nunit':
    case 'csharp-xunit':
      if (stepName)
        return `eyes.Check(Target.Window().Fully().WithName("${stepName}").BeforeRenderScreenshotHook(preRenderHook));`
      else return `eyes.Check(Target.Window().Fully().BeforeRenderScreenshotHook(preRenderHook));`
  }
}

async function emitCheckElement(language, { locatorEmitter, isVisualGridEnabled } = {}, _locator, stepName) {
  const locator = locatorEmitter ? await locatorEmitter(_locator) : _locator
  switch (language) {
    case 'java-junit':
      return `eyes.check(Target.window().region(${locator})${
        isVisualGridEnabled ? '.beforeRenderScreenshotHook(preRenderHook)' : ''
      }${stepName ? `.withName("${stepName}")` : ''});`
    case 'javascript-mocha':
      if (stepName) return `await eyes.check("${stepName}", Target.region(${locator}).webHook(preRenderHook))`
      else
        return `await eyes.check((new URL(await driver.getCurrentUrl())).pathname, Target.region(${locator}).webHook(preRenderHook))`
    case 'python-pytest':
      if (stepName) return `self.eyes.check("${stepName}", Target.region([${locator}]))`
      else return `self.eyes.check(urlparse(self.driver.current_url).path, Target.region([${locator}]))`
    case 'ruby-rspec':
      if (stepName)
        return `@eyes.check("${stepName}", Applitools::Selenium::Target.region(${locator}).script_hook(@pre_render_hook))`
      else
        return `@eyes.check(URI.parse(@driver.current_url).path, Applitools::Selenium::Target.region(${locator}).script_hook(@pre_render_hook))`
    case 'csharp-nunit':
    case 'csharp-xunit':
      if (stepName)
        return `eyes.Check(Target.Region(${locator}).WithName("${stepName}").BeforeRenderScreenshotHook(preRenderHook));`
      else return `eyes.Check(Target.Region(${locator}).BeforeRenderScreenshotHook(preRenderHook));`
  }
}

function emitSetMatchLevel(language, level) {
  switch (language) {
    case 'java-junit':
      return `eyes.setMatchLevel("${level}");`
    case 'javascript-mocha':
      return `await eyes.setMatchLevel("${level}");`
    case 'python-pytest':
      return `self.eyes.match_level("${level}")`
    case 'ruby-rspec':
      return `@eyes.match_level("${level}")`
    case 'csharp-nunit':
    case 'csharp-xunit':
      return '' // TODO -- needs to be set in beforeEach config object
  }
}

function emitSetMatchTimeout(language, timeout) {
  switch (language) {
    case 'java-junit':
      return `eyes.setMatchTimeout(${timeout});`
    case 'javascript-mocha':
      return `eyes.setMatchTimeout(${timeout})`
    case 'python-pytest':
      return `self.eyes.match_timeout(${timeout})`
    case 'ruby-rspec':
      return `@eyes.match_timeout(${timeout})`
    case 'csharp-nunit':
    case 'csharp-xunit':
      return '' // TODO -- needs to be set in beforeEach config object
  }
}

function emitSetPreRenderHook(language, { isVisualGridEnabled } = {}, jsSnippet) {
  switch (language) {
    case 'java-junit':
      if (isVisualGridEnabled) return `preRenderHook = "${jsSnippet}";`
      else return `preRenderHook = "";`
    case 'javascript-mocha':
      if (isVisualGridEnabled) return `preRenderHook = "${jsSnippet}"`
      else return `preRenderHook = ""`
    case 'python-pytest':
      // not implemented in the SDK yet
      return ''
    case 'ruby-rspec':
      if (isVisualGridEnabled) return `preRenderHook = '${jsSnippet}'`
      else return `preRenderHook = ''`
    case 'csharp-nunit':
    case 'csharp-xunit':
      if (isVisualGridEnabled) return `preRenderHook = "${jsSnippet}";`
      else return ''
  }
}

function emitSetViewportSize(language, width, height) {
  if (isNaN(width) && width.includes('x')) {
    const viewportSizes = width.split('x')
    width = viewportSizes[0]
    height = viewportSizes[1]
  }
  switch (language) {
    case 'java-junit':
      return `Eyes.setViewportSize(driver, new RectangleSize(${width}, ${height}));`
    case 'javascript-mocha':
      return `await eyes.setViewportSize({ width: ${width}, height: ${height} })`
    case 'python-pytest':
      return `self.eyes.viewport_size = {'width': ${width}, 'height': ${height}}`
    case 'ruby-rspec':
      return '' // handled in beforeEach
    case 'csharp-nunit':
    case 'csharp-xunit':
      return '' // handled in beforeEach
  }
}

// hooks
function emitAfterEach(language, { isVisualGridEnabled } = {}) {
  let result = ''
  switch (language) {
    case 'java-junit':
      if (isVisualGridEnabled) result += `runner.getAllTestResults();\n`
      result += `eyes.abortIfNotClosed();`
      break
    case 'javascript-mocha':
      if (isVisualGridEnabled) {
        result += `const results = await eyes.getRunner().getAllTestResults()\n`
        result += `console.log(results)\n`
      }
      result += `eyes.abortIfNotClosed()`
      break
    case 'python-pytest':
      if (isVisualGridEnabled) result += `self.vg_runner.get_all_test_results()`
      else result += `self.eyes.abort()`
      break
    case 'ruby-rspec':
      if (isVisualGridEnabled) result += `@visual_grid_runner.get_all_test_results`
      else result += `@eyes.abort_if_not_closed`
      break
    case 'csharp-nunit':
    case 'csharp-xunit':
      if (isVisualGridEnabled) {
        result += `TestResultsSummary allTestResults = runner.GetAllTestResults();`
        result += `\nSystem.Console.WriteLine(allTestResults);`
      } else {
        result += `eyes.AbortIfNotClosed();`
      }
      break
  }
  return result
}

function emitVisualGridOptions(visualGridOptions, { deviceEmitter, browserEmitter } = {}) {
  let result = ''
  visualGridOptions.forEach(browser => {
    if (browser.deviceName) result += deviceEmitter(browser.deviceId, browser.screenOrientation)
    else {
      browser.type = browser.id ? browser.id : browser.name
      result += browserEmitter(browser)
    }
  })
  return result
}

function emitBeforeEach(
  language,
  projectName,
  testName,
  { baselineEnvName, viewportSize, visualGridOptions, accessibilitySettings } = {}
) {
  let result = ''
  switch (language) {
    case 'java-junit':
      if (visualGridOptions) {
        result += `runner = new VisualGridRunner(concurrency);\neyes = new Eyes(runner);\n`
        result += `Configuration config = eyes.getConfiguration();\n`
        const deviceEmitter = (deviceId, orientation) => {
          deviceId = deviceId.replace(/iPhone_6_7_8_Plus/, 'iPhone6_7_8_Plus')
          return `\nconfig.addDeviceEmulation(DeviceName.${deviceId}, ScreenOrientation.${orientation.toUpperCase()});`
        }
        const browserEmitter = browser => {
          return `\nconfig.addBrowser(${browser.width}, ${browser.height}, BrowserType.${browser.type.toUpperCase()});`
        }
        result += emitVisualGridOptions(visualGridOptions, {
          deviceEmitter,
          browserEmitter,
        })
      } else {
        result += `eyes = new Eyes();`
        result += `\neyes.setApiKey(System.getenv("APPLITOOLS_API_KEY"));`
        result += `\nConfiguration config = eyes.getConfiguration();`
        if (baselineEnvName) result += `\neyes.setBaseLineEnvName("${baselineEnvName}");`
      }
      if (accessibilitySettings) {
        result += `\nAccessibilitySettings settings = new AccessibilitySettings(AccessibilityLevel.${accessibilitySettings.level}, AccessibilityGuidelinesVersion.${accessibilitySettings.guidelinesVersion});`
        result += `\nconfig.setAccessibilityValidation(settings);`
      }
      result += `\neyes.setConfiguration(config);`
      result += `\neyes.open(driver, "${projectName}", "${testName}");`
      break
    case 'javascript-mocha':
      if (visualGridOptions) {
        result += `eyes = new Eyes(new VisualGridRunner())\n`
        result += `const config = new Configuration()\n`
        result += 'config.setConcurrentSessions(10)'
        const deviceEmitter = (deviceId, orientation) => {
          return `\nconfig.addDeviceEmulation(DeviceName.${deviceId}, ScreenOrientation.${orientation.toUpperCase()})`
        }
        const browserEmitter = browser => {
          return `\nconfig.addBrowser(${browser.width}, ${browser.height}, BrowserType.${browser.type.toUpperCase()})`
        }
        result += emitVisualGridOptions(visualGridOptions, {
          deviceEmitter,
          browserEmitter,
        })
        if (accessibilitySettings) {
          result += `\nconfig.setAccessibilityValidation(${JSON.stringify(accessibilitySettings)})`
        }
        result += `\neyes.setConfiguration(config)`
      } else {
        result += `eyes = new Eyes()`
        if (accessibilitySettings) {
          result += `\nconst config = eyes.getConfiguration();`
          result += `\nconfig.setAccessibilityValidation(${JSON.stringify(accessibilitySettings)})`
          result += `\neyes.setConfiguration(config);`
        }
      }
      result += `\neyes.setApiKey(process.env["APPLITOOLS_API_KEY"])`
      if (baselineEnvName) result += `\neyes.setBaselineEnvName("${baselineEnvName}")`
      result += `\nawait eyes.open(driver, "${projectName}", "${testName}")`
      break
    case 'python-pytest':
      result += `config = Configuration()\n`
      if (visualGridOptions) {
        result += `concurrency = 10\n`
        result += `self.vg_runner = VisualGridRunner(concurrency)\n`
        result += `self.eyes = Eyes(self.vg_runner)\n`
        const deviceEmitter = (deviceId, orientation) => {
          deviceId = deviceId.replace(/iPhone_6_7_8_Plus/, 'iPhone6_7_8_Plus')
          return `\nconfig.add_device_emulation(DeviceName.${deviceId}, ScreenOrientation.${orientation.toUpperCase()})`
        }
        const browserEmitter = browser => {
          return `\nconfig.add_browser(${browser.width}, ${browser.height}, BrowserType.${browser.type.toUpperCase()})`
        }
        result += emitVisualGridOptions(visualGridOptions, {
          deviceEmitter,
          browserEmitter,
        })
        result += `\nself.eyes.configuration = config`
      } else {
        result += `self.eyes = Eyes()`
      }
      result += `\nself.eyes.api_key = os.environ["APPLITOOLS_API_KEY"]`
      if (baselineEnvName) result += `\nself.eyes.baseline_env_name = "${baselineEnvName}"`
      if (accessibilitySettings) {
        result += `\nsetting = AccessibilitySettings(
          AccessibilityLevel.${accessibilitySettings.level}, AccessibilityGuidelinesVersion.${accessibilitySettings.guidelinesVersion}
        )`
        result += `\nconfig.accessibility_validation = setting`
      }
      result += `\nself.eyes.open(self.driver, "${projectName}", "${testName}")`
      break
    case 'ruby-rspec':
      viewportSize = viewportSize ? viewportSize : '1024x768'
      if (visualGridOptions) {
        result += `@visual_grid_runner = Applitools::Selenium::VisualGridRunner.new(10)\n`
        result += `@eyes = Applitools::Selenium::Eyes.new(visual_grid_runner: @visual_grid_runner)\n`
        result += `config = Applitools::Selenium::Configuration.new.tap do |c|\n`
        result += `  c.api_key = ENV['APPLITOOLS_API_KEY']\n`
        result += `  c.app_name = '${projectName}'\n`
        result += `  c.test_name = '${testName}'\n`
        result += `  c.viewport_size = Applitools::RectangleSize.for('${viewportSize}')\n`
        if (accessibilitySettings) {
          result += `  c.accessibility_validation = Applitools::AccessibilitySettings.new(Applitools::AccessibilityLevel::${accessibilitySettings.level}, Applitools::AccessibilityGuidelinesVersion::${accessibilitySettings.guidelinesVersion})`
        }
        if (baselineEnvName) result += `\n  c.baseline_env_name = '${baselineEnvName}'`
        const deviceEmitter = (deviceId, orientation) => {
          const deviceName = deviceId.replace(/_/g, '')
          return `\n  c.add_device_emulation(Devices::${deviceName.charAt(0).toUpperCase() +
            deviceName.substring(1)}, Orientations::${orientation.toUpperCase()})`
        }
        const browserEmitter = browser => {
          return `\n  c.add_browser(${browser.width}, ${browser.height}, BrowserTypes::${browser.type.toUpperCase()})`
        }
        result += emitVisualGridOptions(visualGridOptions, {
          deviceEmitter,
          browserEmitter,
        })
        result += `\nend`
        result += `\n@eyes.config = config`
        result += `\n@eyes.open(driver: @driver)`
      } else {
        result += `@eyes = Applitools::Selenium::Eyes.new`
        if (accessibilitySettings) {
          result += `\nconfig = @eyes.get_configuration`
          result += `\nconfig.accessibility_validation = Applitools::AccessibilitySettings.new(Applitools::AccessibilityLevel::${accessibilitySettings.level}, Applitools::AccessibilityGuidelinesVersion::${accessibilitySettings.guidelinesVersion})`
          result += `\n@eyes.config = config`
        }
        result += `\n@eyes.api_key = ENV['APPLITOOLS_API_KEY']`
        if (baselineEnvName) result += `\n@eyes.baseline_env_name = '${baselineEnvName}'`
        result += `\n@eyes.open(driver: @driver, app_name: '${projectName}', test_name: '${testName}', viewport_size: '${viewportSize}')`
      }
      break
    case 'csharp-nunit':
    case 'csharp-xunit':
      // TODO:
      // - set matchLevel
      viewportSize = viewportSize ? viewportSize.split('x') : ['1024', '768']
      result += `\nConfiguration conf = new Configuration();`
      result += `\nconf.SetTestName("${testName}");`
      result += `\nconf.SetAppName("${projectName}");`
      result += `\nconf.SetViewportSize(new Size(${viewportSize[0]}, ${viewportSize[1]}));`
      if (accessibilitySettings) {
        result += `\nAccessibilitySettings settings = new AccessibilitySettings(AccessibilityLevel.${accessibilitySettings.level}, AccessibilityGuidelinesVersion.${accessibilitySettings.guidelinesVersion});`
        result += `\nconf.SetAccessibilityValidation(settings);`
      }
      if (baselineEnvName) result += `\nconf.SetBaselineEnvName("${baselineEnvName}");`
      if (visualGridOptions) {
        const deviceEmitter = (deviceId, orientation) => {
          return `\nconf.AddDeviceEmulation(DeviceName.${deviceId}, ScreenOrientation.${orientation
            .charAt(0)
            .toUpperCase() + orientation.substring(1)});`
        }
        const browserEmitter = browser => {
          return `\nconf.AddBrowser(${browser.width}, ${browser.height}, BrowserType.${browser.type.toUpperCase()});`
        }
        result += emitVisualGridOptions(visualGridOptions, {
          deviceEmitter,
          browserEmitter,
        })
        result += `\nrunner = new VisualGridRunner(10);`
        result += `\neyes = new Eyes(runner);`
      } else result += `\neyes = new Eyes();`
      result += `\neyes.SetConfiguration(conf);`
      result += `\neyes.Open(driver);`
      break
  }
  return result
}

function emitDependency(language, { isVisualGridEnabled, hasAccessibilitySettings } = {}) {
  let result = ''
  switch (language) {
    case 'java-junit':
      result += `import com.applitools.eyes.selenium.Eyes;`
      result += `\nimport com.applitools.eyes.RectangleSize;`
      result += `\nimport com.applitools.eyes.selenium.fluent.Target;`
      result += `\nimport com.applitools.eyes.selenium.Configuration;`
      if (isVisualGridEnabled) {
        result += `\nimport com.applitools.eyes.selenium.BrowserType;`
        result += `\nimport com.applitools.eyes.visualgrid.model.DeviceName;`
        result += `\nimport com.applitools.eyes.visualgrid.model.ScreenOrientation;`
        result += `\nimport com.applitools.eyes.visualgrid.services.VisualGridRunner;`
      }
      if (hasAccessibilitySettings) {
        result += `\nimport com.applitools.eyes.AccessibilitySettings;`
        result += `\nimport com.applitools.eyes.AccessibilityLevel;`
        result += `\nimport com.applitools.eyes.AccessibilityGuidelinesVersion;`
      }
      break
    case 'javascript-mocha':
      result += `const { Eyes, Target } = require('@applitools/eyes-selenium')`
      if (isVisualGridEnabled)
        result += `\nconst { Configuration, VisualGridRunner, BrowserType, DeviceName, ScreenOrientation } = require('@applitools/eyes-selenium')`
      break
    case 'python-pytest':
      result += `import os\n`
      result += `from urllib.parse import urlparse\n`
      result += `from applitools.selenium import (Eyes, Target, Configuration)\n`
      if (isVisualGridEnabled) {
        result += `from applitools.selenium import (BrowserType, DeviceName, ScreenOrientation)\n`
        result += `from applitools.selenium.visual_grid import VisualGridRunner\n`
      }
      if (hasAccessibilitySettings) {
        result += `from applitools.common.accessibility import (AccessibilitySettings, AccessibilityLevel, AccessibilityGuidelinesVersion)\n`
      }
      break
    case 'ruby-rspec':
      result += `require 'eyes_selenium'`
      break
    case 'csharp-nunit':
    case 'csharp-xunit':
      result += `using Applitools;\n`
      result += `using Applitools.Selenium;\n`
      result += `using Applitools.VisualGrid;\n`
      result += `using System.Drawing;\n`
      result += `using Configuration = Applitools.Selenium.Configuration;\n`
      result += `using ScreenOrientation = Applitools.VisualGrid.ScreenOrientation;`
      break
  }
  return result
}

function emitInEachEnd(language, { isVisualGridEnabled } = {}) {
  switch (language) {
    case 'java-junit':
      if (isVisualGridEnabled) return undefined
      else return `eyes.close();`
    case 'javascript-mocha':
      if (isVisualGridEnabled) return undefined
      else return `await eyes.close()`
    case 'python-pytest':
      if (isVisualGridEnabled) return `self.eyes.close_async()`
      else return `self.eyes.close()`
    case 'ruby-rspec':
      return `@eyes.close(false)`
    case 'csharp-nunit':
    case 'csharp-xunit':
      if (isVisualGridEnabled) return undefined
      else return `eyes.CloseAsync();`
  }
}

function emitVariable(language, { isVisualGridEnabled } = {}) {
  let result
  switch (language) {
    case 'java-junit':
      result = `private Eyes eyes;` // eslint-disable-line
      if (isVisualGridEnabled) {
        result += `\nprivate VisualGridRunner runner;\n`
        result += `final int concurrency = 5;\n`
        result += `private String preRenderHook;`
      }
      return result
    case 'javascript-mocha':
      return `let eyes\nlet preRenderHook`
    case ('python-pytest', 'ruby-rspec'):
      return undefined
    case 'csharp-nunit':
    case 'csharp-xunit':
      result = `Eyes eyes;`
      result += `\nstring preRenderHook;`
      if (isVisualGridEnabled) result += `\nVisualGridRunner runner;`
      return result
  }
}

module.exports = {
  emitCheckWindow,
  emitCheckElement,
  emitSetMatchLevel,
  emitSetMatchTimeout,
  emitSetPreRenderHook,
  emitSetViewportSize,
  emitAfterEach,
  emitBeforeEach,
  emitDependency,
  emitInEachEnd,
  emitVariable,
}
