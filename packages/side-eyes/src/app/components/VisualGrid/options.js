export const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge Chromium', 'Edge Legacy', 'IE11', 'IE10']
export const browserIds = { ie10: 'IE_10', ie11: 'IE_11' }
export const experimentalBrowsers = []
export const viewportSizes = ['2560x1440', '2048x1536', '1920x1080', '750x1334', '720x1280']
export const orientations = ['Portrait', 'Landscape']

// Copied from @applitools/eyes-sdk-core/lib/config/DeviceName.js
// and @applitools/eyes-sdk-core/lib/config/IosDeviceName.js
// since it can't easily be loaded into the browser (yet).
const DeviceName = {
  Blackberry_PlayBook: 'Blackberry PlayBook',
  BlackBerry_Z30: 'BlackBerry Z30',
  Galaxy_A5: 'Galaxy A5',
  Galaxy_Note_10: 'Galaxy Note 10',
  Galaxy_Note_10_Plus: 'Galaxy Note 10 Plus',
  Galaxy_Note_2: 'Galaxy Note 2',
  Galaxy_Note_3: 'Galaxy Note 3',
  Galaxy_Note_4: 'Galaxy Note 4',
  Galaxy_Note_8: 'Galaxy Note 8',
  Galaxy_Note_9: 'Galaxy Note 9',
  Galaxy_S10: 'Galaxy S10',
  Galaxy_S20: 'Galaxy S20',
  Galaxy_S10_Plus: 'Galaxy S10 Plus',
  Galaxy_S3: 'Galaxy S3',
  Galaxy_S5: 'Galaxy S5',
  Galaxy_S8: 'Galaxy S8',
  Galaxy_S8_Plus: 'Galaxy S8 Plus',
  Galaxy_S9: 'Galaxy S9',
  Galaxy_S9_Plus: 'Galaxy S9 Plus',
  iPad: 'iPad',
  iPad_6th_Gen: 'iPad 6th Gen',
  iPad_7th_Gen: 'iPad 7th Gen',
  iPad_Air_2: 'iPad Air 2',
  iPad_Mini: 'iPad Mini',
  iPad_Pro: 'iPad Pro',
  iPhone_11: 'iPhone 11',
  iPhone_11_Pro: 'iPhone 11 Pro',
  iPhone_11_Pro_Max: 'iPhone 11 Pro Max',
  iPhone_4: 'iPhone 4',
  iPhone_5SE: 'iPhone 5/SE',
  iPhone_6_7_8: 'iPhone 6/7/8',
  iPhone_6_7_8_Plus: 'iPhone 6/7/8 Plus',
  iPhone_X: 'iPhone X',
  iPhone_XR: 'iPhone XR',
  iPhone_XS: 'iPhone XS',
  iPhone_XS_Max: 'iPhone XS Max',
  Kindle_Fire_HDX: 'Kindle Fire HDX',
  Laptop_with_HiDPI_screen: 'Laptop with HiDPI screen',
  Laptop_with_MDPI_screen: 'Laptop with MDPI screen',
  Laptop_with_touch: 'Laptop with touch',
  LG_G6: 'LG G6',
  LG_Optimus_L70: 'LG Optimus L70',
  Microsoft_Lumia_550: 'Microsoft Lumia 550',
  Microsoft_Lumia_950: 'Microsoft Lumia 950',
  Nexus_10: 'Nexus 10',
  Nexus_4: 'Nexus 4',
  Nexus_5: 'Nexus 5',
  Nexus_5X: 'Nexus 5X',
  Nexus_6: 'Nexus 6',
  Nexus_6P: 'Nexus 6P',
  Nexus_7: 'Nexus 7',
  Nokia_Lumia_520: 'Nokia Lumia 520',
  Nokia_N9: 'Nokia N9',
  OnePlus_7T: 'OnePlus 7T',
  OnePlus_7T_Pro: 'OnePlus 7T Pro',
  Pixel_2: 'Pixel 2',
  Pixel_2_XL: 'Pixel 2 XL',
  Pixel_3: 'Pixel 3',
  Pixel_3_XL: 'Pixel 3 XL',
  Pixel_4: 'Pixel 4',
  Pixel_4_XL: 'Pixel 4 XL',
}

const IosDeviceName = {
  iPhone_11_Pro: 'iPhone 11 Pro',
  iPhone_11_Pro_Max: 'iPhone 11 Pro Max',
  iPhone_11: 'iPhone 11',
  iPhone_XR: 'iPhone XR',
  iPhone_XS: 'iPhone Xs',
  iPhone_X: 'iPhone X',
  iPhone_8: 'iPhone 8',
  iPhone_7: 'iPhone 7',
  iPad_Pro_3: 'iPad Pro (12.9-inch) (3rd generation)',
  iPad_7: 'iPad (7th generation)',
  iPad_Air_2: 'iPad Air (2nd generation)',
  iPhone_12_Pro_Max: 'iPhone 12 Pro Max',
  iPhone_12_Pro: 'iPhone 12 Pro',
  iPhone_12: 'iPhone 12',
  iPhone_12_mini: 'iPhone 12 mini',
}

function makeDeviceList() {
  const emulators = Object.values(DeviceName).map(entry => {
    const id = Object.keys(DeviceName).find(key => DeviceName[key] === entry)
    return { name: entry, type: 'emulator', id }
  })
  const simulators = Object.values(IosDeviceName).map(entry => {
    return { name: entry, type: 'simulator' }
  })
  return [...emulators, ...simulators]
}

export const DeviceList = makeDeviceList()

export function updateBrowserNamesForBackwardsCompatibility(browsers) {
  return browsers.map(browserName => {
    switch (browserName) {
      case 'Edge':
        return 'Edge Legacy'
      default:
        return browserName
    }
  })
}

export function transformLegacySelectedDeviceOptions(options) {
  return options.map(entry => {
    return typeof entry === 'string' ? { name: entry, type: 'emulator' } : entry
  })
}
