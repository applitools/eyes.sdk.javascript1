export type SessionType = 'SEQUENTIAL' | 'PROGRESSION'

export type StitchMode = 'CSS' | 'Scroll'

export type MatchLevel = 'None' | 'Layout1' | 'Layout' | 'Layout2' | 'Content' | 'Strict' | 'Exact'

export type AccessibilityRegionType = 'IgnoreContrast' | 'RegularText' | 'LargeText' | 'BoldText' | 'GraphicalObject'

export type AccessibilityLevel = 'AA' | 'AAA'

export type AccessibilityGuidelinesVersion = 'WCAG_2_0' | 'WCAG_2_1'

export type AccessibilityStatus = 'Passed' | 'Failed'

export type TestResultsStatus = 'Passed' | 'Unresolved' | 'Failed'

export type Proxy = {
  url: string
  username?: string
  password?: string
  isHttpOnly?: boolean
}

export type CustomProperty = {
  name: string
  value: string
}

export type Batch = {
  id?: string
  name?: string
  sequenceName?: string
  startedAt?: Date | string
  notifyOnCompletion?: boolean
  properties?: CustomProperty[]
}

export type DriverInfo = {
  sessionId?: string
  isMobile?: boolean
  isNative?: boolean
  isCDP?: boolean
  deviceName?: string
  platformName?: string
  platformVersion?: string
  browserName?: string
  browserVersion?: string
}

export type Location = {
  x: number
  y: number
}

export type Size = {
  width: number
  height: number
}

export type Region = Location & Size

export type TextRegion = Region & {text: string}

export type ImageRotation = -270 | -180 | -90 | 0 | 90 | 180 | 270

export type ImageCropRect = {
  top: number
  right: number
  bottom: number
  left: number
}

export type ImageCropRegion = {
  x: number
  y: number
  width: number
  height: number
}

export type DesktopBrowser =
  | 'chrome'
  | 'chrome-one-version-back'
  | 'chrome-two-versions-back'
  | 'firefox'
  | 'firefox-one-version-back'
  | 'firefox-two-versions-back'
  | 'ie'
  | 'ie10'
  | 'edge'
  | 'edgechromium'
  | 'edgelegacy'
  | 'edgechromium-one-version-back'
  | 'edgechromium-two-versions-back'
  | 'safari'
  | 'safari-earlyaccess'
  | 'safari-one-version-back'
  | 'safari-two-versions-back'

export type DesktopBrowserRenderer = {
  name?: DesktopBrowser
  width: number
  height: number
}

export type ScreenOrientation = 'portrait' | 'landscape'

export type ChromeEmulationDevice =
  | 'Blackberry PlayBook'
  | 'BlackBerry Z30'
  | 'Galaxy A5'
  | 'Galaxy Note 10'
  | 'Galaxy Note 10 Plus'
  | 'Galaxy Note 2'
  | 'Galaxy Note 3'
  | 'Galaxy Note 4'
  | 'Galaxy Note 8'
  | 'Galaxy Note 9'
  | 'Galaxy S10'
  | 'Galaxy S10 Plus'
  | 'Galaxy S3'
  | 'Galaxy S5'
  | 'Galaxy S8'
  | 'Galaxy S8 Plus'
  | 'Galaxy S9'
  | 'Galaxy S9 Plus'
  | 'iPad'
  | 'iPad 6th Gen'
  | 'iPad 7th Gen'
  | 'iPad Air 2'
  | 'iPad Mini'
  | 'iPad Pro'
  | 'iPhone 11'
  | 'iPhone 11 Pro'
  | 'iPhone 11 Pro Max'
  | 'iPhone 4'
  | 'iPhone 5/SE'
  | 'iPhone 6/7/8'
  | 'iPhone 6/7/8 Plus'
  | 'iPhone X'
  | 'iPhone XR'
  | 'iPhone XS'
  | 'iPhone XS Max'
  | 'Kindle Fire HDX'
  | 'Laptop with HiDPI screen'
  | 'Laptop with MDPI screen'
  | 'Laptop with touch'
  | 'LG G6'
  | 'LG Optimus L70'
  | 'Microsoft Lumia 550'
  | 'Microsoft Lumia 950'
  | 'Nexus 10'
  | 'Nexus 4'
  | 'Nexus 5'
  | 'Nexus 5X'
  | 'Nexus 6'
  | 'Nexus 6P'
  | 'Nexus 7'
  | 'Nokia Lumia 520'
  | 'Nokia N9'
  | 'OnePlus 7T'
  | 'OnePlus 7T Pro'
  // | 'OnePlus 8'
  // | 'OnePlus 8 Pro'
  | 'Pixel 2'
  | 'Pixel 2 XL'
  | 'Pixel 3'
  | 'Pixel 3 XL'
  | 'Pixel 4'
  | 'Pixel 4 XL'

export type ChromeEmulationDeviceRenderer = {
  chromeEmulationInfo: {
    deviceName: ChromeEmulationDevice
    screenOrientation?: ScreenOrientation
  }
}

export type IOSDevice =
  | 'iPhone 11 Pro'
  | 'iPhone 11 Pro Max'
  | 'iPhone 11'
  | 'iPhone XR'
  | 'iPhone Xs'
  | 'iPhone X'
  | 'iPhone 8'
  | 'iPhone 7'
  | 'iPad Pro (12.9-inch) (3rd generation)'
  | 'iPad (7th generation)'
  | 'iPad Air (2nd generation)'

export type IOSVersion = 'latest' | 'latest-1'

export type IOSDeviceRenderer = {
  iosDeviceInfo: {
    deviceName: IOSDevice
    iosVersion?: IOSVersion
    screenOrientation?: ScreenOrientation
  }
}

export type MatchResult = {
  readonly asExpected?: boolean
  readonly windowId?: number
}

export type TestResult = {
  readonly testId?: string
  readonly name?: string
  readonly secretToken?: string
  readonly status?: TestResultsStatus
  readonly appName?: string
  readonly batchId?: string
  readonly batchName?: string
  readonly branchName?: string
  readonly hostOS?: string
  readonly hostApp?: string
  readonly hostDisplaySize?: Size
  readonly accessibilityStatus?: {
    readonly level: AccessibilityLevel
    readonly version: AccessibilityGuidelinesVersion
    readonly status: AccessibilityStatus
  }
  readonly startedAt?: Date | string
  readonly duration?: number
  readonly isNew?: boolean
  readonly isDifferent?: boolean
  readonly isAborted?: boolean
  readonly appUrls?: SessionUrls
  readonly apiUrls?: SessionUrls
  readonly stepsInfo?: StepInfo[]
  readonly steps?: number
  readonly matches?: number
  readonly mismatches?: number
  readonly missing?: number
  readonly exactMatches?: number
  readonly strictMatches?: number
  readonly contentMatches?: number
  readonly layoutMatches?: number
  readonly noneMatches?: number
  readonly url?: string
}

export type StepInfo = {
  readonly name?: string
  readonly isDifferent?: boolean
  readonly hasBaselineImage?: boolean
  readonly hasCurrentImage?: boolean
  readonly appUrls?: AppUrls
  readonly apiUrls?: ApiUrls
  readonly renderId?: string[]
}

export type ApiUrls = {
  readonly baselineImage?: string
  readonly currentImage?: string
  readonly checkpointImage?: string
  readonly checkpointImageThumbnail?: string
  readonly diffImage?: string
}

export type AppUrls = {
  readonly step?: string
  readonly stepEditor?: string
}

export type SessionUrls = {
  readonly batch?: string
  readonly session?: string
}

export type Cookie = {
  name: string
  value: string
  domain?: string
  path?: string
  expires?: Date
  sameSite?: string
  httpOnly?: boolean
  secure?: boolean
}

export type CookiesObject = {
  cookies: Cookie[]
  all: boolean
}