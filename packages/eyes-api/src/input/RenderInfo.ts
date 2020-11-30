import BrowserName from '../enums/BrowserName'
import DeviceName from '../enums/DeviceName'
import IOSDeviceName from '../enums/IOSDeviceName'
import ScreenOrientation from '../enums/ScreenOrientation'

export type DesktopBrowserInfo = {
  name?: BrowserName
  width: number
  height: number
}

export type EmulationInfo<TDeviceName> = {
  deviceName: TDeviceName
  screenOrientation?: ScreenOrientation
}

export type ChromeEmulationInfo = {
  chromeEmulationInfo: EmulationInfo<DeviceName>
}

export type IOSEmulationInfo = {
  iosEmulationInfo: EmulationInfo<IOSDeviceName>
}

export type RenderInfo = DesktopBrowserInfo | ChromeEmulationInfo | IOSEmulationInfo | EmulationInfo<DeviceName>
