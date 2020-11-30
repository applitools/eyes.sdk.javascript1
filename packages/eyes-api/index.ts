// #region ENUM

export {default as AccessibilityGuidelinesVersion} from './src/enums/AccessibilityGuidelinesVersion'
export {default as AccessibilityLevel} from './src/enums/AccessibilityLevel'
export {default as AccessibilityRegionType} from './src/enums/AccessibilityRegionType'
export {default as AccessibilityStatus} from './src/enums/AccessibilityStatus'
export {default as BrowserType} from './src/enums/BrowserName'
export {default as DeviceName} from './src/enums/DeviceName'
export {default as IosDeviceName} from './src/enums/IOSDeviceName'
export {default as MatchLevel} from './src/enums/MatchLevel'
export {default as ScreenOrientation} from './src/enums/ScreenOrientation'
export {default as StitchMode} from './src/enums/StitchMode'
export {default as SessionType} from './src/enums/SessionType'
export {default as TestResultsStatus} from './src/enums/TestResultsStatus'

// #endregion

// #region INPUT

export {CheckSettings as CheckSettingsPlain, default as CheckSettings} from './src/input/CheckSettings'
export {
  GeneralConfig as GeneralConfigurationPlain,
  OpenConfig as OpenConfigurationPlain,
  CheckConfig as CheckConfigurationPlain,
  ClassicConfig as ClassicConfigurationPlain,
  VGConfig as VGConfigurationPlain,
  Config as ConfigurationPlain,
  default as Configuration,
} from './src/input/Config'
export {ProxySettings as ProxySettingsPlain, default as ProxySettings} from './src/input/ProxySettings'
export {
  ImageMatchSettings as ImageMatchSettingsPlain,
  default as ImageMatchSettings,
} from './src/input/ImageMatchSettings'
export {
  ExactMatchSettings as ExactMatchSettingsPlain,
  default as ExactMatchSettings,
} from './src/input/ExactMatchSettings'
export {
  AccessibilityRegion as AccessibilityMatchSettingsPlain,
  default as AccessibilityMatchSettings,
} from './src/input/AccessibilityRegion'
export {AccessibilitySettings} from './src/input/AccessibilitySettings'
export {
  FloatingRegion as FloatingMatchSettingsPlain,
  default as FloatingMatchSettings,
} from './src/input/FloatingRegion'
export {BatchInfo as BatchInfoPlain, default as BatchInfo} from './src/input/BatchInfo'
export {CustomProperty as PropertyDataPlain, default as PropertyData} from './src/input/CustomProperty'
export {RenderInfo} from './src/input/RenderInfo'
export {Location as LocationPlain, default as Location} from './src/input/Location'
export {RectangleSize as RectangleSizePlain, default as RectangleSize} from './src/input/RectangleSize'
export {Region as RegionPlain, default as Region} from './src/input/Region'

// #endregion

// #region OUTPUT

export {ApiUrls as ApiUrlsPlain, default as ApiUrls} from './src/output/ApiUrls'
export {AppUrls as AppUrlsPlain, default as AppUrls} from './src/output/AppUrls'
export {SessionUrls as SessionUrlsPlain, default as SessionUrls} from './src/output/SessionUrls'
export {StepInfo as StepInfoPlain, default as StepInfo} from './src/output/StepInfo'
export {TestResults as TestResultsPlain, default as TestResults} from './src/output/TestResults'
export {MatchResult as MatchResultPlain, default as MatchResult} from './src/output/MatchResult'

// #endregion

export {default as EyesRunner, ClassicRunner, VisualGridRunner} from './src/Runners'
export {default as Eyes} from './src/Eyes'
