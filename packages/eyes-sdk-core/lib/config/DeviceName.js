const Enum = require('../utils/Enum')

/**
 * @typedef {import('../utils/Enum').EnumValues<typeof DeviceNames>} DeviceName
 */

const DeviceNames = Enum('DeviceName', {
  /** @type {'Blackberry PlayBook'} */
  Blackberry_PlayBook: 'Blackberry PlayBook',
  /** @type {'BlackBerry Z30'} */
  BlackBerry_Z30: 'BlackBerry Z30',
  /** @type {'Galaxy A5'} */
  Galaxy_A5: 'Galaxy A5',
  /** @type {'Galaxy Note 10'} */
  Galaxy_Note_10: 'Galaxy Note 10',
  /** @type {'Galaxy Note 10 Plus'} */
  Galaxy_Note_10_Plus: 'Galaxy Note 10 Plus',
  /** @type {'Galaxy Note 2'} */
  Galaxy_Note_2: 'Galaxy Note 2',
  /** @type {'Galaxy Note 3'} */
  Galaxy_Note_3: 'Galaxy Note 3',
  /** @type {'Galaxy Note 4'} */
  Galaxy_Note_4: 'Galaxy Note 4',
  /** @type {'Galaxy Note 8'} */
  Galaxy_Note_8: 'Galaxy Note 8',
  /** @type {'Galaxy Note 9'} */
  Galaxy_Note_9: 'Galaxy Note 9',
  /** @type {'Galaxy S10'} */
  Galaxy_S10: 'Galaxy S10',
  /** @type {'Galaxy S10 Plus'} */
  Galaxy_S10_Plus: 'Galaxy S10 Plus',
  /** @type {'Galaxy S3'} */
  Galaxy_S3: 'Galaxy S3',
  /** @type {'Galaxy S5'} */
  Galaxy_S5: 'Galaxy S5',
  /** @type {'Galaxy S8'} */
  Galaxy_S8: 'Galaxy S8',
  /** @type {'Galaxy S8 Plus'} */
  Galaxy_S8_Plus: 'Galaxy S8 Plus',
  /** @type {'Galaxy S9'} */
  Galaxy_S9: 'Galaxy S9',
  /** @type {'Galaxy S9 Plus'} */
  Galaxy_S9_Plus: 'Galaxy S9 Plus',
  /** @type {'iPad'} */
  iPad: 'iPad',
  /** @type {'iPad 6th Gen'} */
  iPad_6th_Gen: 'iPad 6th Gen',
  /** @type {'iPad 7th Gen'} */
  iPad_7th_Gen: 'iPad 7th Gen',
  /** @type {'iPad Air 2'} */
  iPad_Air_2: 'iPad Air 2',
  /** @type {'iPad Mini'} */
  iPad_Mini: 'iPad Mini',
  /** @type {'iPad Pro'} */
  iPad_Pro: 'iPad Pro',
  /** @type {'iPhone 11'} */
  iPhone_11: 'iPhone 11',
  /** @type {'iPhone 11 Pro'} */
  iPhone_11_Pro: 'iPhone 11 Pro',
  /** @type {'iPhone 11 Pro Max'} */
  iPhone_11_Pro_Max: 'iPhone 11 Pro Max',
  /** @type {'iPhone 4'} */
  iPhone_4: 'iPhone 4',
  /** @type {'iPhone 5/SE'} */
  iPhone_5SE: 'iPhone 5/SE',
  /** @type {'iPhone 6/7/8'} */
  iPhone_6_7_8: 'iPhone 6/7/8',
  /** @type {'iPhone 6/7/8 Plus'} */
  iPhone_6_7_8_Plus: 'iPhone 6/7/8 Plus',
  /** @type {'iPhone X'} */
  iPhone_X: 'iPhone X',
  /** @type {'iPhone XR'} */
  iPhone_XR: 'iPhone XR',
  /** @type {'iPhone XS'} */
  iPhone_XS: 'iPhone XS',
  /** @type {'iPhone XS Max'} */
  iPhone_XS_Max: 'iPhone XS Max',
  /** @type {'Kindle Fire HDX'} */
  Kindle_Fire_HDX: 'Kindle Fire HDX',
  /** @type {'Laptop with HiDPI screen'} */
  Laptop_with_HiDPI_screen: 'Laptop with HiDPI screen',
  /** @type {'Laptop with MDPI screen'} */
  Laptop_with_MDPI_screen: 'Laptop with MDPI screen',
  /** @type {'Laptop with touch'} */
  Laptop_with_touch: 'Laptop with touch',
  /** @type {'LG G6'} */
  LG_G6: 'LG G6',
  /** @type {'LG Optimus L70'} */
  LG_Optimus_L70: 'LG Optimus L70',
  /** @type {'Microsoft Lumia 550'} */
  Microsoft_Lumia_550: 'Microsoft Lumia 550',
  /** @type {'Microsoft Lumia 950'} */
  Microsoft_Lumia_950: 'Microsoft Lumia 950',
  /** @type {'Nexus 10'} */
  Nexus_10: 'Nexus 10',
  /** @type {'Nexus 4'} */
  Nexus_4: 'Nexus 4',
  /** @type {'Nexus 5'} */
  Nexus_5: 'Nexus 5',
  /** @type {'Nexus 5X'} */
  Nexus_5X: 'Nexus 5X',
  /** @type {'Nexus 6'} */
  Nexus_6: 'Nexus 6',
  /** @type {'Nexus 6P'} */
  Nexus_6P: 'Nexus 6P',
  /** @type {'Nexus 7'} */
  Nexus_7: 'Nexus 7',
  /** @type {'Nokia Lumia 520'} */
  Nokia_Lumia_520: 'Nokia Lumia 520',
  /** @type {'Nokia N9'} */
  Nokia_N9: 'Nokia N9',
  /** @type {'OnePlus 7T'} */
  OnePlus_7T: 'OnePlus 7T',
  /** @type {'OnePlus 7T Pro'} */
  OnePlus_7T_Pro: 'OnePlus 7T Pro',
  // /** @type {nePlus_8: 'OnePlus 8'} */
  // OnePlus_8: 'OnePlus 8',
  // /** @type {nePlus_8_Pro: 'OnePlus 8 Pro'} */
  // OnePlus_8_Pro: 'OnePlus 8 Pro',
  /** @type {'Pixel 2'} */
  Pixel_2: 'Pixel 2',
  /** @type {'Pixel 2 XL'} */
  Pixel_2_XL: 'Pixel 2 XL',
  /** @type {'Pixel 3'} */
  Pixel_3: 'Pixel 3',
  /** @type {'Pixel 3 XL'} */
  Pixel_3_XL: 'Pixel 3 XL',
  /** @type {'Pixel 4'} */
  Pixel_4: 'Pixel 4',
  /** @type {'Pixel 4 XL'} */
  Pixel_4_XL: 'Pixel 4 XL',
})

module.exports = DeviceNames
