/** 
  * @instantiate class Eyes from EyesClassic
  * @signature `new Eyes(runner)`
  * @sigparam {EyesRunner} [runner]
  * @sigreturn {Eyes}
  * @instantiate param EyesWrappedElement<TDriver,TElement,TSelector> to EyesWebElement
  * TBD two definitions for EyesWrappedElement- are they both correct?
  * @instantiate param EyesWrappedElement<TElement, TSelector> to EyesWebElement
  * @instantiate param ElementReference<TElement,TSelector> to By|WebElement|EyesWebElement
  * @instantiate param RegionReference<TElement,TSelector> to By|WebElement|EyesWebElement|GetRegion|Region
  * @instantiate param EyesWrappedDriver<TDriver,TElement,TSelector> to EyesWebDriver
  * @instantiate param CheckSettings<TElement,TSelector> to SeleniumCheckSettings
  * @instantiate param TDriver to WebDriver
  * @instantiate param TElement to WebElement
  * @instantiate param TSelector to By
  * @instantiate param EyesWrappedDriver to EyesWebDriver
  * @instantiate param FrameReference<TDriver,TElement,TSelector> to number|string|By|WebElement|EyesWebElement
  * @instantiate param TLocatorName to TBD_SELENIUM_LOCATOR
  */
  
  /**
  * @instantiate class  SeleniumCheckSettings from CheckSettings
  * @instantiate param CheckSettings<TElement,TSelector> to SeleniumCheckSettings
  * @instantiate param RegionReference<TElement,TSelector> to By|WebElement|EyesWebElement|GetRegion|Region
  * @instantiate param FrameReference<TDriver,TElement,TSelector> to number|string|By|WebElement|EyesWebElement
  * @instantiate param FrameReference<TElement, TSelector> to number|string|By|WebElement|EyesWebElement
  * @instantiate param ElementReference<TElement,TSelector> to By|WebElement|EyesWebElement
  */
  