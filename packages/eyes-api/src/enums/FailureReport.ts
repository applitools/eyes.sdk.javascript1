export enum FailureReportEnum {
  IMMEDIATE = 'IMMEDIATE',
  ON_CLOSE = 'ON_CLOSE',
}

export type FailureReport = `${FailureReportEnum}`
