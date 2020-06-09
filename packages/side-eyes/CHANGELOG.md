# Changelog

## Unreleased

## v1.11.0
- updated browser and device list to support new options in the Ultrafast Grid [Trello 337](https://trello.com/c/epkkyC4m)
- added Contrast Advisor to the UI [Trello 337](https://trello.com/c/epkkyC4m)
- updated code export to support the new accessibility API [Trello 376](https://trello.com/c/twf0by90)
- updated code emitting (for the SIDE command-line runner) to support the new accessibility API [Trello 375](https://trello.com/c/MDTajLRa)
- updated to @applitools/dom-capture@7.2.4 (from 7.1.3)
- updated to @applitools/dom-snapshot@3.5.3 (from ^3.0.5)
- updated to @applitools/visual-grid-client@14.4.4 (from 14.4.1)
- updated to @applitools/eyes-images@4.14.0 (from 4.13.0)

## v1.10.1
- Updated underlying dependencies to support 10.9 fallback mode ([Trello 242](https://trello.com/c/540knBrZ) and [Trello 255](https://trello.com/c/M9o24k6d))

## v1.10.0
- Fixed UX bug with the tooltip when downloading the visual grid config
- Added Safari as a browser option when running on the visual grid [Trello 179](https://trello.com/c/h8KIkB4x)
- Updated the UI to refer to the visual grid as the "Ultrafast Grid" [Trello 179](https://trello.com/c/h8KIkB4x)
- Updated underlying Applitools SDKs to latest [Trello 144](https://trello.com/c/TiUiXE26)
- Updated underlying and transitive dependencies to resolve security vulnerabilities

## v1.9.1
- Changed the user agent formatting sent to Eyes

## v1.9.0
- Added support for check commands in nested tests
- Added C# code export support
- Added Ruby code export support
- Added accessibilty support to code export
- Fixed bug in the runner when setting the accessibility level

## v1.8.1
- GUI Fixes

## v1.8.0
- Added experimental accessibility validations

## v1.7.7
- Testing new publishing mechanism

## v1.7.6
- Testing new publishing mechanism

## v1.7.5
- Updated visual-grid-client and related dependencies

## v1.7.4
- Added new devices to visual grid device selection

## v1.7.3
- Updated visual-grid-client SDK & React version

## v1.7.2
- Updated visual-grid-client SDK version
- Updated transitive dependencies to resolve audit warnings

## v1.7.1
- Updated underlying dependencies

## v1.7.0
- Moved IE & Edge as selectable browsers for the visual grid out from behind the experimental feature toggle
- Fixed Python's code export for `check element` commands when they use a CSS selector
- Updated the underlying SDK for local image processing

## v1.6.0
- Added a new command - `eyes set pre render hook`
- Updated the underlying SDK for the visual grid

## v1.5.0
- Added JavaScript code export support

## v1.4.0
- Added Python code export support

## v1.3.0
- Underlying SDK upgrade
- Added support for enablePatterns and useDom, through an expermiental feature toggle in the UI
- Fixed a bug in result parsing when dealing with an incomplete results object

## v1.2.0
- Added a new option under the experimental feature toggle, to enable legacy DOM snapshotting for the visual grid

## v1.1.5
- Added verbose logging when running against the visual grid

## v1.1.4
- Underlying SDK upgrade which removes the need to use eval for domCapture and domSnapshot

## v1.1.3
- Re-enabled code export for java-junit

## v1.1.2
- Disabled code export for java-junit due to a bug in Selenium IDE

## v1.1.1
- Fix for fetching external assets with the correct referrer
- Underlying SDK upgrades which fix mysterious mysteries
