import {AccessibilityStatus} from '../enums/AccessibilityStatus'
import {AccessibilityLevel} from '../enums/AccessibilityLevel'
import {AccessibilityGuidelinesVersion} from '../enums/AccessibilityGuidelinesVersion'

export type TestAccessibilityStatus = {
  readonly status: AccessibilityStatus
  readonly level: AccessibilityLevel
  readonly version: AccessibilityGuidelinesVersion
}
