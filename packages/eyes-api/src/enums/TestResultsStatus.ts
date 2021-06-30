export enum TestResultsStatusEnum {
  Passed = 'Passed',
  Unresolved = 'Unresolved',
  Failed = 'Failed',
}

export type TestResultsStatus = `${TestResultsStatusEnum}`
