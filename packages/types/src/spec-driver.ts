import {Size, DriverInfo, CookiesObject} from './data'

export type SpecSelector<TSelector> = TSelector | string | {type: string; selector: string}

export interface SpecDriver<TDriver, TContext, TElement, TSelector> {
  isDriver(driver: any): driver is TDriver
  isContext?(context: any): context is TContext
  isElement(element: any): element is TElement
  isSelector(selector: any): selector is SpecSelector<TSelector>
  transformDriver?(driver: any): TDriver
  transformElement?(element: any): TElement
  extractContext?(element: TDriver | TContext): TContext
  extractSelector?(element: TElement): SpecSelector<TSelector>
  isStaleElementError(error: any): boolean
  isEqualElements(context: TContext, element1: TElement, element2: TElement): Promise<boolean>
  mainContext(context: TContext): Promise<TContext>
  parentContext?(context: TContext): Promise<TContext>
  childContext(context: TContext, element: TElement): Promise<TContext>
  executeScript(context: TContext, script: ((arg?: any) => any) | string, arg?: any): Promise<any>
  findElement(context: TContext, selector: SpecSelector<TSelector>): Promise<TElement | null>
  findElements(context: TContext, selector: SpecSelector<TSelector>): Promise<TElement[]>
  takeScreenshot(driver: TDriver): Promise<Buffer | string>
  getDriverInfo?(driver: TDriver): Promise<DriverInfo>
  getOrientation?(driver: TDriver): Promise<'portrait' | 'landscape'>
  getTitle(driver: TDriver): Promise<string>
  getUrl(driver: TDriver): Promise<string>
  getElementRect?(driver: TDriver, element: TElement): Promise<Size>
  setWindowSize?(driver: TDriver, size: Size): Promise<void>
  getWindowSize?(driver: TDriver): Promise<Size>
  setViewportSize?(driver: TDriver, size: Size): Promise<void>
  getViewportSize?(driver: TDriver): Promise<Size>
  visit?(driver: TDriver, url: string): Promise<void>
  getCookies?(driver: TDriver): Promise<CookiesObject>
}
