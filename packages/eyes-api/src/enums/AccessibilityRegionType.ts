export enum AccessibilityRegionTypeEnum {
  IgnoreContrast = 'IgnoreContrast',
  RegularText = 'RegularText',
  LargeText = 'LargeText',
  BoldText = 'BoldText',
  GraphicalObject = 'GraphicalObject',
}

export type AccessibilityRegionType = `${AccessibilityRegionTypeEnum}`
