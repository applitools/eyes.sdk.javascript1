# SDK spec

## Screenshot types

The following main use cases are supported:

### 1. Viewport

#### API

```js
eyes.check(Target.window())
```

#### Behavior

Just take the screenshot

### 2. Full page

#### API

```js
eyes.check(Target.window().fully())
```

#### Behavior

TBD

### 3. Element

#### API

Element can be provided as one of the following:

1. CSS selector string
2. Selenium Locator object (or equivalent in other frameworks if exists)
3. WebElement object (or equivalent in other frameworks  if exists)

```js
// 1. CSS selector string
eyes.check(Target.region('#content'))

// 2. Selenium locator
eyes.check(Target.region(By.id('content')))

// 3. WebElement
const el = await driver.findElement(By.id('content'))
eyes.check(Target.region(el))

// 3a. WDIO element
const el = await browser.element('#content')
eyes.check(Target.region(el))
```

If element is inside a frame (relative to current driver state), then the frame chain should be specified. The element can still be provided in all possible methods described above by chaining `.region`:

```js
eyes.check(Target.frame('frame').region('#content'))
```

#### Behavior

1. For all inputs except a WebElement, the existence of the element should be verified. For WebElement, need to verify it's not stale, and if it is then refresh it (locator information should exist)

2. [general] hide scrollbars in all frames in the frame chain of (driver/checkSettings?)

3. calculate element's region (EyesWebElement.getRect() (Math.ceil || 0) --> Region with CoordinatesType.CONTEXT_RELATIVE --> this._imageLocation)

4. save image location based on element rect

5. [general] sleep MATCH_INTERVAL (500ms)

6. [general] scroll to 0,0 so that the DOM is synchronized with the image

7. [general] get device pixel ratio

8. [general] get entire size of html element (ContextBaseScaleProvider)

### 4. Element fully

#### API

All methods of providing the element from [the element section](#3.-Element) apply.

#### Behavior

TBD

### 5. Region

#### API

```js
eyes.
```

#### Behavior

TBD

## Coverage tests

### Viewport

- TestCheckPageWithHeader_Window
- TestCheckWindow
- TestCheckWindow_Fluent
- TestCheckWindowAfterScroll
- TestCheckWindowViewport
- TestCheckWindowWithFloatingByRegion_Fluent
- TestCheckWindowWithFloatingBySelector_Fluent
- TestCheckWindowWithIgnoreBySelector_Fluent
- TestCheckWindowWithIgnoreBySelector_Centered_Fluent
- TestCheckWindowWithIgnoreBySelector_Stretched_Fluent
- TestDoubleCheckWindow

### Full page

- TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent
- TestCheckPageWithHeader_Window_Fully
- TestCheckWindow_Body
- TestCheckWindow_Html
- TestCheckWindow_Simple_Html
- TestCheckWindowFully
- TestCheckWindowWithIgnoreRegion_Fluent
- Test_VGTestsCount_1

### Element

- TestCheckElementFully_Fluent
- TestCheckElementWithIgnoreRegionByElementOutsideTheViewport_Fluent
- TestCheckElementWithIgnoreRegionBySameElement_Fluent
- TestCheckPageWithHeader_Region
- TestCheckPageWithHeaderFully_Region
- TestCheckRegion
- TestCheckRegion2
- TestCheckRegionInAVeryBigFrame (failures)
- TestCheckRegionInAVeryBigFrameAfterManualSwitchToFrame (failures)
- TestCheckRegionBySelectorAfterManualScroll_Fluent
- TestCheckRegionInFrame (failures)
- TestCheckRegionInFrame_Fluent (failures)
- TestCheckRegionWithIgnoreRegion_Fluent

### Region

- TestCheckOverflowingRegionByCoordinates_Fluent
- TestCheckRegionByCoordinates_Fluent
- TestCheckRegionByCoordinateInFrame_Fluent (failures)
- TestCheckRegionByCoordinateInFrameFully_Fluent
- TestSimpleRegion

### Frame

- TestCheckFrame
- TestCheckFrame_Fluent
- TestCheckFrameFully_Fluent
- TestCheckFrameInFrame_Fully_Fluent
- TestCheckFrameInFrame_Fully_Fluent2 (?)
- TestCheckRegionInFrame3_Fluent

### Other

- TestScrollbarsHiddenAndReturned_Fluent
