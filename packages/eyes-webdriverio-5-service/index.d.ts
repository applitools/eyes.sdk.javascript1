type ApplitoolsTestResultsSummary = typeof import('@applitools/eyes-sdk-core').TestResultsSummary
type ApplitoolsTestResults = typeof import('@applitools/eyes-sdk-core').TestResults
type ApplitoolsConfiguration = typeof import('@applitools/eyes-webdriverio').Configuration

type ApplitoolsPlainConfiguration = import('@applitools/eyes-sdk-core').PlainConfiguration
type ApplitoolsPlainConfigurationClassic = import('@applitools/eyes-sdk-core').PlainConfigurationClassic
type ApplitoolsPlainConfigurationVisualGrid = import('@applitools/eyes-sdk-core').PlainConfigurationVisualGrid
type ApplitoolsCheckSettings = import('@applitools/eyes-webdriverio').CheckSettings
type ApplitoolsWrappedElement = import('@applitools/eyes-webdriverio').WrappedElement
type ApplitoolsElement = import('@applitools/eyes-webdriverio').Element
type ApplitoolsSelector = import('@applitools/eyes-webdriverio').Selector

declare module WebdriverIO {
  interface ServiceOption extends ApplitoolsPlainConfiguration, ApplitoolsPlainConfigurationClassic, ApplitoolsPlainConfigurationVisualGrid {
    useVisualGrid: boolean,
    concurrency: number
  }
  interface Browser {
    eyesCheck(title: string, checkSettings: ApplitoolsCheckSettings): Promise<void>;
    eyesSetScrollRootElement(element: ApplitoolsWrappedElement | ApplitoolsElement | ApplitoolsSelector): void;
    eyesAddProperty(key: string, value: string): void;
    eyesClearProperties(): void;
    eyesGetTestResults(): Promise<ApplitoolsTestResults>;
    eyesSetConfiguration(configuration: any): void;
    eyesGetConfiguration(): ApplitoolsConfiguration;
    eyesGetIsOpen(): boolean;
    eyesGetAllTestResults(): Promise<ApplitoolsTestResultsSummary>;
  }
}
