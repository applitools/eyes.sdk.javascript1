export enum IosVersionEnum {
  LATEST = 'latest',
  ONE_VERSION_BACK = 'latest-1',
  /** @deprecated */
  LATEST_ONE_VERSION_BACK = 'latest-1',
}

export type IosVersion = `${IosVersionEnum}`
