import {AccessibilityLevel} from '../enums/AccessibilityLevel'
import {AccessibilityGuidelinesVersion} from '../enums/AccessibilityGuidelinesVersion'

export type AccessibilitySettings = {
  level?: AccessibilityLevel
  guidelinesVersion?: AccessibilityGuidelinesVersion
}
