// #region ENUM
export {
  AccessibilityGuidelinesVersion as AccessibilityGuidelinesVersionPlain,
  AccessibilityGuidelinesVersionEnum as AccessibilityGuidelinesVersion,
} from './enums/AccessibilityGuidelinesVersion'
export {
  AccessibilityLevel as AccessibilityLevelPlain,
  AccessibilityLevelEnum as AccessibilityLevel,
} from './enums/AccessibilityLevel'
export {
  AccessibilityRegionType as AccessibilityRegionTypePlain,
  AccessibilityRegionTypeEnum as AccessibilityRegionType,
} from './enums/AccessibilityRegionType'
export {
  AccessibilityStatus as AccessibilityStatusPlain,
  AccessibilityStatusEnum as AccessibilityStatus,
} from './enums/AccessibilityStatus'
export {BrowserType as BrowserTypePlain, BrowserTypeEnum as BrowserType} from './enums/BrowserType'
export {
  CorsIframeHandle as CorsIframeHandlePlain,
  CorsIframeHandleEnum as CorsIframeHandle,
} from './enums/CorsIframeHandle'
export {DeviceName as DeviceNamePlain, DeviceNameEnum as DeviceName} from './enums/DeviceName'
export {FailureReport as FailureReportPlain, FailureReportEnum as FailureReport} from './enums/FailureReport'
export {IosDeviceName as IosDeviceNamePlain, IosDeviceNameEnum as IosDeviceName} from './enums/IosDeviceName'
export {IosVersion as IosVersionPlain, IosVersionEnum as IosVersion} from './enums/IosVersion'
export {MatchLevel as MatchLevelPlain, MatchLevelEnum as MatchLevel} from './enums/MatchLevel'
export {
  ScreenOrientation as ScreenOrientationPlain,
  ScreenOrientationEnum as ScreenOrientation,
} from './enums/ScreenOrientation'
export {SessionType as SessionTypePlain, SessionTypeEnum as SessionType} from './enums/SessionType'
export {StitchMode as StitchModePlain, StitchModeEnum as StitchMode} from './enums/StitchMode'
export {
  TestResultsStatus as TestResultsStatusPlain,
  TestResultsStatusEnum as TestResultsStatus,
} from './enums/TestResultsStatus'
// #endregion

// #region ERROR
export {EyesError} from './errors/EyesError'
export {TestFailedError} from './errors/TestFailedError'
export {DiffsFoundError} from './errors/DiffsFoundError'
export {NewTestError} from './errors/NewTestError'
// #endregion

// #region INPUT
export {
  AccessibilityMatchSettings as AccessibilityMatchSettingsPlain,
  AccessibilityMatchSettingsData as AccessibilityMatchSettings,
} from './input/AccessibilityMatchSettings'
export {AccessibilitySettings} from './input/AccessibilitySettings'
export {BatchInfo as BatchInfoPlain, BatchInfoData as BatchInfo} from './input/BatchInfo'
export {CheckSettings as CheckSettingsPlain, CheckSettingsFluent as CheckSettings, Target} from './input/CheckSettings'
export {Configuration as ConfigurationPlain, ConfigurationData as Configuration} from './input/Configuration'
export {
  CutProvider as CutProviderPlain,
  CutProviderData as CutProvider,
  FixedCutProviderData as FixedCutProvider,
  UnscaledFixedCutProviderData as UnscaledFixedCutProvider,
} from './input/CutProvider'
export {
  ExactMatchSettings as ExactMatchSettingsPlain,
  ExactMatchSettingsData as ExactMatchSettings,
} from './input/ExactMatchSettings'
export {
  FloatingMatchSettings as FloatingMatchSettingsPlain,
  FloatingMatchSettingsData as FloatingMatchSettings,
} from './input/FloatingMatchSettings'
export {
  ImageMatchSettings as ImageMatchSettingsPlain,
  ImageMatchSettingsData as ImageMatchSettings,
} from './input/ImageMatchSettings'
export {ImageRotation as ImageRotationPlain, ImageRotationData as ImageRotation} from './input/ImageRotation'
export {Location as LocationPlain, LocationData as Location} from './input/Location'
export {
  LogHandler as LogHandlerPlain,
  CustomLogHandler as CustomLogHandlerPlain,
  FileLogHandler as FileLogHandlerPlain,
  ConsoleLogHandler as ConsoleLogHandlerPlain,
  LogHandlerData as LogHandler,
  FileLogHandlerData as FileLogHandler,
  ConsoleLogHandlerData as ConsoleLogHandler,
  NullLogHandlerData as NullLogHandler,
} from './input/LogHandler'
export {OCRRegion} from './input/OCRRegion'
export {OCRSettings} from './input/OCRSettings'
export {PropertyData as PropertyDataPlain, PropertyDataData as PropertyData} from './input/PropertyData'
export {ProxySettings as ProxySettingsPlain, ProxySettingsData as ProxySettings} from './input/ProxySettings'
export {RectangleSize as RectangleSizePlain, RectangleSizeData as RectangleSize} from './input/RectangleSize'
export {Region as RegionPlain, RegionData as Region} from './input/Region'
export {DesktopBrowserInfo, ChromeEmulationInfo, IOSDeviceInfo} from './input/RenderInfo'
export {
  RunnerOptions as RunnerOptionsPlain,
  RunnerOptionsFluent,
  RunnerOptionsFluentInit as RunnerOptions,
} from './input/RunnerOptions'
export {VisualLocatorSettings} from './input/VisualLocatorSettings'
// #endregion

// #region OUTPUT
export {ApiUrls as ApiUrlsPlain, ApiUrlsData as ApiUrls} from './output/ApiUrls'
export {AppUrls as AppUrlsPlain, AppUrlsData as AppUrls} from './output/AppUrls'
export {MatchResult as MatchResultPlain, MatchResultData as MatchResult} from './output/MatchResult'
export {SessionUrls as SessionUrlsPlain, SessionUrlsData as SessionUrls} from './output/SessionUrls'
export {StepInfo as StepInfoPlain, StepInfoData as StepInfo} from './output/StepInfo'
export {TestAccessibilityStatus} from './output/TestAccessibilityStatus'
export {TestResults as TestResultsPlain, TestResultsData as TestResults} from './output/TestResults'
export {
  TestResultContainer as TestResultContainerPlain,
  TestResultContainerData as TestResultContainer,
} from './output/TestResultContainer'
export {
  TestResultsSummary as TestResultsSummaryPlain,
  TestResultsSummaryData as TestResultsSummary,
} from './output/TestResultsSummary'
export {TextRegion} from './output/TextRegion'
export {ValidationInfo as ValidationInfoPlain, ValidationInfoData as ValidationInfo} from './output/ValidationInfo'
export {
  ValidationResult as ValidationResultPlain,
  ValidationResultData as ValidationResult,
} from './output/ValidationResult'
// #endregion

export {Logger} from './Logger'
export {Eyes} from './Eyes'
export {BatchClose, closeBatch} from './BatchClose'
export {EyesRunner, ClassicRunner, VisualGridRunner} from './Runners'
export {SessionEventHandler, SessionEventHandlers, RemoteSessionEventHandler} from './SessionEventHandlers'
