'use strict';

const common = require('@applitools/eyes-common');
const core = require('@applitools/eyes-sdk-core');

exports.ImagesCheckSettings = require('./lib/fluent/ImagesCheckSettings').ImagesCheckSettings;
exports.Target = require('./lib/fluent/Target').Target;

exports.Eyes = require('./lib/Eyes').Eyes;


// eyes-common
exports.AccessibilityLevel = common.AccessibilityLevel;
exports.AccessibilityMatchSettings = common.AccessibilityMatchSettings;
exports.AccessibilityRegionType = common.AccessibilityRegionType;
exports.BatchInfo = common.BatchInfo;
exports.BrowserType = common.BrowserType;
exports.Configuration = common.Configuration;
exports.DeviceName = common.DeviceName;
exports.ExactMatchSettings = common.ExactMatchSettings;
exports.FloatingMatchSettings = common.FloatingMatchSettings;
exports.ImageMatchSettings = common.ImageMatchSettings;
exports.MatchLevel = common.MatchLevel;
exports.PropertyData = common.PropertyData;
exports.ProxySettings = common.ProxySettings;
exports.ScreenOrientation = common.ScreenOrientation;
exports.StitchMode = common.StitchMode;
exports.DebugScreenshotsProvider = common.DebugScreenshotsProvider;
exports.FileDebugScreenshotsProvider = common.FileDebugScreenshotsProvider;
exports.NullDebugScreenshotProvider = common.NullDebugScreenshotProvider;
exports.EyesError = common.EyesError;
exports.CoordinatesType = common.CoordinatesType;
exports.Location = common.Location;
exports.RectangleSize = common.RectangleSize;
exports.Region = common.Region;
exports.PropertyHandler = common.PropertyHandler;
exports.ReadOnlyPropertyHandler = common.ReadOnlyPropertyHandler;
exports.SimplePropertyHandler = common.SimplePropertyHandler;
exports.ImageDeltaCompressor = common.ImageDeltaCompressor;
exports.MutableImage = common.MutableImage;
exports.ConsoleLogHandler = common.ConsoleLogHandler;
exports.DebugLogHandler = common.DebugLogHandler;
exports.FileLogHandler = common.FileLogHandler;
exports.Logger = common.Logger;
exports.LogHandler = common.LogHandler;
exports.NullLogHandler = common.NullLogHandler;


// eyes-sdk-core
exports.ImageProvider = core.ImageProvider;
exports.FullPageCaptureAlgorithm = core.FullPageCaptureAlgorithm;
exports.EyesSimpleScreenshotFactory = core.EyesSimpleScreenshotFactory;
exports.CorsIframeHandle = core.CorsIframeHandle;
exports.CutProvider = core.CutProvider;
exports.FixedCutProvider = core.FixedCutProvider;
exports.NullCutProvider = core.NullCutProvider;
exports.UnscaledFixedCutProvider = core.UnscaledFixedCutProvider;
exports.ScaleProvider = core.ScaleProvider;
exports.FixedScaleProvider = core.FixedScaleProvider;
exports.FixedScaleProviderFactory = core.FixedScaleProviderFactory;
exports.PositionMemento = core.PositionMemento;
exports.PositionProvider = core.PositionProvider;
exports.RemoteSessionEventHandler = core.RemoteSessionEventHandler;
exports.SessionEventHandler = core.SessionEventHandler;
exports.ValidationInfo = core.ValidationInfo;
exports.ValidationResult = core.ValidationResult;
exports.CoordinatesTypeConversionError = core.CoordinatesTypeConversionError;
exports.DiffsFoundError = core.DiffsFoundError;
exports.NewTestError = core.NewTestError;
exports.OutOfBoundsError = core.OutOfBoundsError;
exports.TestFailedError = core.TestFailedError;
exports.MatchResult = core.MatchResult;
exports.NullRegionProvider = core.NullRegionProvider;
exports.RegionProvider = core.RegionProvider;
exports.RunningSession = core.RunningSession;
exports.SessionType = core.SessionType;
exports.FailureReports = core.FailureReports;
exports.TestResults = core.TestResults;
exports.TestResultsFormatter = core.TestResultsFormatter;
exports.TestResultsStatus = core.TestResultsStatus;
