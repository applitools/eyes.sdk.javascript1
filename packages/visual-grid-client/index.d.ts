
declare namespace Eyes {
  export namespace Open {
    interface Options {
      /**
       * Your app name.
       * Default value: undefined
       */
      appName?:string
      
      /**
       * Test name.
       * Default value: undefined
       */
      testName?: string
      
      /**
       * The size and browser of the generated screenshots.
       * This doesn't need to be the same as the browser that driver is running. 
       * It could be a different size and also a different browser.
       * Default value: { width: 800, height: 600, name: 'chrome' }
       */
      browser?:DeviceViewport|BrowserViewport|(DeviceViewport|BrowserViewport)[]
      
      /**
       * Whether to save troubleshooting data. See the troubleshooting section of this doc for more info.
       * Default value: false
       */
      saveDebugData?:boolean
      
      /**
       * Provides ability to group tests into batches.
       * Read more about batches here: https://applitools.com/docs/topics/working-with-test-batches/how-to-group-tests-into-batches.html
       * Default value: random
       */
      batchId?:string
      
      /**
       * Provides a name to the batch (for display purpose only).
       * Default value: The name of the first test in the batch
       */
      batchName?:string
      
      /**
       * Name for managing batch statistics.
       * Default value: undefined
       */
      batchSequenceName?:string
      
      /**
       * The name of the environment of the baseline.
       * Default value: undefined
       */
      baselineEnvName?:string
      
      /**
       * A name for the environment in which the application under test is running.
       * Default value: undefined
       */
      envName?:string
      
      /**
       * Whether to ignore or the blinking caret or not when comparing images.
       * Default value: false
       */
      ignoreCaret?:boolean
      
      /**
       * The method to use when comparing two screenshots, which expresses the extent to which the two images are expected to match. 
       * Read more about match levels https://help.applitools.com/hc/en-us/articles/360007188591-Match-Levels .
       * Default value: Strict
       */
      matchLevel?:'Strict'|'Exact'|'Layout'|'Content'
      
      /**
       * The name of the baseline branch.
       * Default value: undefined
       */
      baselineBranchName?:string
      
      /**
       * Sets the branch under which new branches are created.
       * Default value: undefined
       */
      parentBranchName?:string
      
      /**
       * Set whether or not failed tests are saved by default.
       * Default value: false
       */
      saveFailedTests?:boolean
      
      /**
       * Set whether or not new tests are saved by default.
       * Default value: false
       */
      saveNewTests?:boolean
      
      /**
       * Custom properties for the eyes test. The format is an array of objects with name/value properties. 
       * Default value: undefined
       * @example [{name: 'My prop', value:'My value'}]
       */
      properties?:{name:string, value:any}[]
      
      /**
       * Default value: false
       */
      compareWithParentBranch?:boolean
      
      /**
       * Default value: false
       */
      ignoreBaseline?:boolean
      
      /**
       * The accessibility level to use for the screenshots
       * Default value: 'None'
       */
      accessibilityLevel?:AccessibilityLevel
      
      /**
       * Set wether batch completion notifications should be sent.
       * Default value: false
       */
      notifyOnCompletion?:boolean

      /**
       * Disable all eyes functionality.
       * Default value: false
       */
      isDisabled?:boolean
    }
    
    interface BrowserViewport {
      height:number
      width:number
      name:'chrome'|'firefox'|'edge'|'ie10'|'ie11'
    }
  
    interface DeviceViewport {
      deviceName: string
      screenOrientation?: 'portrait'|'landscape'
      name?:string
    }
  }

  type AccessibilityLevel = "None"|"AA"|"AAA"

  export namespace Check {
    interface Options {
      /**
       * A logical name for this check.
       */
      tag?: string
      
      /**
       * window
       * This is the default value. If set then the captured image is of the entire page or the viewport, 
       * use fully for specifying what window mode to use.
       * region
       * If set then the captured image is of the parts of the page, 
       * use this parameter with region or selector for specifying the areas to captured.
       */
      target?: 'window'|'region'
      
      /**
       * In case target is window, if fully is true (default) then the snapshot is of the entire page, 
       * if fully is false then snapshot is of the viewport.
       */
      fully?:boolean
      
      /**
       * In case target is region, this should be the actual css or xpath selector to an element, 
       * and the screenshot would be the content of that element.
       */
      selector?:string|Selector
      
      /**
       * In case target is region, this should be an object describing the region's coordinates for capturing the image.
       */
      region?:Region
      
      /**
       * A single or an array of regions to ignore when checking for visual differences.
       */
      ignore?:Region|Selector|(Region|Selector)[]
      
      /**
       * A single or an array of floating regions to ignore when checking for visual differences. 
       * More information about floating regions can be 
       * found in https://help.applitools.com/hc/en-us/articles/360006915292-Testing-of-floating-UI-elements .
       */
      floating?:FloatingRegion|FloatingSelector|(FloatingRegion|FloatingSelector)[]
      
      /**
       * A single or an array of regions to match as layout level.
       * See: https://help.applitools.com/hc/en-us/articles/360007188591-Match-Levels
       */
      layout?:Region|Selector|(Region|Selector)[]

      /**
       * A single or an array of regions to match as content level.
       * See: https://help.applitools.com/hc/en-us/articles/360007188591-Match-Levels
       */
      content?:Region|Selector|(Region|Selector)[]

      /**
       * A single or an array of regions to match as strict level.
       * See: https://help.applitools.com/hc/en-us/articles/360007188591-Match-Levels
       */
      strict?:Region|Selector|(Region|Selector)[]

      /**
       * A single or an array of regions to perform accessibility checks.
       */
      accessibility?:AccessibilityRegion|AccessibilitySelector|(AccessibilityRegion|AccessibilitySelector)[]

      /**
       * A set of scripts to be run by the browser during the rendering. 
       * It is intended to be used as a means to alter the page's state and structure at the time of rendering. 
       * An object with the following properties:
       */
      scriptHooks?:{beforeCaptureScreenshot:string}
      
      /**
       * A flag to specify whether a capture of DOM and CSS should be taken when rendering the screenshot. 
       * The default value is true. This should only be modified to troubleshoot unexpected behavior, 
       * and not for normal production use.
       */
      sendDom?:boolean

      /**
       * The accessibility level to use for the screenshot
       * Default value: 'None'
       */
      accessibilityLevel?:AccessibilityLevel
    }

    interface Selector {
      type?:'css'|'xpath'
      selector: string
    }

    interface Region {
      top: number 
      left: number 
      width: number
      height: number
    }

    interface FloatingRegion extends Region {
      maxUpOffset: number
      maxDownOffset: number
      maxLeftOffset: number
      maxRightOffset: number
    }

    interface FloatingSelector extends Selector {
      maxUpOffset: number
      maxDownOffset: number
      maxLeftOffset: number
      maxRightOffset: number
    }

    type AccessibilityType = "IgnoreContrast"|"RegularText"|"LargeText"|"BoldText"|"GraphicalObject"

    interface AccessibilityRegion extends Region {
      accessibilityType: AccessibilityType
    }

    interface AccessibilitySelector extends Selector {
      accessibilityType: AccessibilityType
    }
  }
}