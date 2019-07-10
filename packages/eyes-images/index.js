'use strict';

const common = require('@applitools/eyes-common');
const core = require('@applitools/eyes-sdk-core');

exports.ImagesCheckSettings = require('./lib/fluent/ImagesCheckSettings').ImagesCheckSettings;
exports.Target = require('./lib/fluent/Target').Target;

exports.Eyes = require('./lib/Eyes').Eyes;


// eyes-common
exports.MatchLevel = common.MatchLevel;
exports.ImageMatchSettings = common.ImageMatchSettings;
exports.ExactMatchSettings = common.ExactMatchSettings;
exports.FloatingMatchSettings = common.FloatingMatchSettings;
exports.BatchInfo = common.BatchInfo;
exports.PropertyData = common.PropertyData;
exports.ProxySettings = common.ProxySettings;
exports.EyesError = common.EyesError;
exports.DebugScreenshotsProvider = common.DebugScreenshotsProvider;
exports.FileDebugScreenshotsProvider = common.FileDebugScreenshotsProvider;
exports.NullDebugScreenshotProvider = common.NullDebugScreenshotProvider;
exports.Location = common.Location;
exports.RectangleSize = common.RectangleSize;
exports.Region = common.Region;
exports.MutableImage = common.MutableImage;
exports.Logger = common.Logger;
exports.ConsoleLogHandler = common.ConsoleLogHandler;
exports.FileLogHandler = common.FileLogHandler;
exports.LogHandler = common.LogHandler;
exports.NullLogHandler = common.NullLogHandler;


// eyes-sdk-core
exports.ImageProvider = core.ImageProvider;
exports.CorsIframeHandle = core.CorsIframeHandle;
exports.CutProvider = core.CutProvider;
exports.FixedCutProvider = core.FixedCutProvider;
exports.NullCutProvider = core.NullCutProvider;
exports.UnscaledFixedCutProvider = core.UnscaledFixedCutProvider;
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
