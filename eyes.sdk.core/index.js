'use strict';

exports.AppOutputProvider = require('./lib/capture/AppOutputProvider').AppOutputProvider;
exports.AppOutputWithScreenshot = require('./lib/capture/AppOutputWithScreenshot').AppOutputWithScreenshot;
exports.EyesScreenshot = require('./lib/capture/EyesScreenshot').EyesScreenshot;
exports.EyesScreenshotFactory = require('./lib/capture/EyesScreenshotFactory').EyesScreenshotFactory;
exports.EyesSimpleScreenshot = require('./lib/capture/EyesSimpleScreenshot').EyesSimpleScreenshot;
exports.ImageProvider = require('./lib/capture/ImageProvider').ImageProvider;

exports.CutProvider = require('./lib/cropping/CutProvider').CutProvider;
exports.FixedCutProvider = require('./lib/cropping/FixedCutProvider').FixedCutProvider;
exports.NullCutProvider = require('./lib/cropping/NullCutProvider').NullCutProvider;
exports.UnscaledFixedCutProvider = require('./lib/cropping/UnscaledFixedCutProvider').UnscaledFixedCutProvider;

exports.DebugScreenshotsProvider = require('./lib/debug/DebugScreenshotsProvider').DebugScreenshotsProvider;
exports.FileDebugScreenshotsProvider = require('./lib/debug/FileDebugScreenshotsProvider').FileDebugScreenshotsProvider;
exports.NullDebugScreenshotProvider = require('./lib/debug/NullDebugScreenshotProvider').NullDebugScreenshotProvider;

exports.RemoteSessionEventHandler = require('./lib/events/RemoteSessionEventHandler').RemoteSessionEventHandler;
exports.SessionEventHandler = require('./lib/events/SessionEventHandler').SessionEventHandler;
exports.ValidationInfo = require('./lib/events/ValidationInfo').ValidationInfo;
exports.ValidationResult = require('./lib/events/ValidationResult').ValidationResult;

exports.CoordinatesTypeConversionError = require('./lib/errors/CoordinatesTypeConversionError').CoordinatesTypeConversionError;
exports.DiffsFoundError = require('./lib/errors/DiffsFoundError').DiffsFoundError;
exports.EyesError = require('./lib/errors/EyesError').EyesError;
exports.NewTestError = require('./lib/errors/NewTestError').NewTestError;
exports.OutOfBoundsError = require('./lib/errors/OutOfBoundsError').OutOfBoundsError;
exports.TestFailedError = require('./lib/errors/TestFailedError').TestFailedError;

exports.CheckSettings = require('./lib/fluent/CheckSettings').CheckSettings;
exports.CheckTarget = require('./lib/fluent/CheckTarget').CheckTarget;
exports.FloatingRegionByRectangle = require('./lib/fluent/FloatingRegionByRectangle').FloatingRegionByRectangle;
exports.GetFloatingRegion = require('./lib/fluent/GetFloatingRegion').GetFloatingRegion;
exports.GetRegion = require('./lib/fluent/GetRegion').GetRegion;
exports.IgnoreRegionByRectangle = require('./lib/fluent/IgnoreRegionByRectangle').IgnoreRegionByRectangle;

exports.CoordinatesType = require('./lib/geometry/CoordinatesType').CoordinatesType;
exports.Location = require('./lib/geometry/Location').Location;
exports.RectangleSize = require('./lib/geometry/RectangleSize').RectangleSize;
exports.Region = require('./lib/geometry/Region').Region;

exports.ImageDeltaCompressor = require('./lib/images/ImageDeltaCompressor').ImageDeltaCompressor;
exports.ImageUtils = require('./lib/images/ImageUtils').ImageUtils;
exports.MutableImage = require('./lib/images/MutableImage').MutableImage;

exports.ConsoleLogHandler = require('./lib/logging/ConsoleLogHandler').ConsoleLogHandler;
exports.FileLogHandler = require('./lib/logging/FileLogHandler').FileLogHandler;
exports.Logger = require('./lib/logging/Logger').Logger;
exports.LogHandler = require('./lib/logging/LogHandler').LogHandler;
exports.NullLogHandler = require('./lib/logging/NullLogHandler').NullLogHandler;

exports.AppOutput = require('./lib/match/AppOutput').AppOutput;
exports.ExactMatchSettings = require('./lib/match/ExactMatchSettings').ExactMatchSettings;
exports.FloatingMatchSettings = require('./lib/match/FloatingMatchSettings').FloatingMatchSettings;
exports.ImageMatchSettings = require('./lib/match/ImageMatchSettings').ImageMatchSettings;
exports.MatchLevel = require('./lib/match/MatchLevel').MatchLevel;
exports.MatchResult = require('./lib/match/MatchResult').MatchResult;
exports.MatchSingleWindowData = require('./lib/match/MatchSingleWindowData').MatchSingleWindowData;
exports.MatchWindowData = require('./lib/match/MatchWindowData').MatchWindowData;
exports.MatchWindowDataWithScreenshot = require('./lib/match/MatchWindowDataWithScreenshot').MatchWindowDataWithScreenshot;

exports.metadata = require('./lib/metadata/index');

exports.InvalidPositionProvider = require('./lib/positioning/InvalidPositionProvider').InvalidPositionProvider;
exports.NullRegionProvider = require('./lib/positioning/NullRegionProvider').NullRegionProvider;
exports.PositionMemento = require('./lib/positioning/PositionMemento').PositionMemento;
exports.PositionProvider = require('./lib/positioning/PositionProvider').PositionProvider;
exports.RegionProvider = require('./lib/positioning/RegionProvider').RegionProvider;

exports.RenderInfo = require('./lib/renderer/RenderInfo').RenderInfo;
exports.RenderingInfo = require('./lib/renderer/RenderingInfo').RenderingInfo;
exports.RenderRequest = require('./lib/renderer/RenderRequest').RenderRequest;
exports.RenderStatus = require('./lib/renderer/RenderStatus').RenderStatus;
exports.RenderStatusResults = require('./lib/renderer/RenderStatusResults').RenderStatusResults;
exports.RGridDom = require('./lib/renderer/RGridDom').RGridDom;
exports.RGridResource = require('./lib/renderer/RGridResource').RGridResource;
exports.RunningRender = require('./lib/renderer/RunningRender').RunningRender;
exports.EmulationInfo = require('./lib/renderer/EmulationInfo').EmulationInfo;
exports.EmulationDevice = require('./lib/renderer/EmulationDevice').EmulationDevice;
exports.ScreenOrientation = require('./lib/renderer/ScreenOrientation').ScreenOrientation;

exports.ContextBasedScaleProvider = require('./lib/scaling/ContextBasedScaleProvider').ContextBasedScaleProvider;
exports.ContextBasedScaleProviderFactory = require('./lib/scaling/ContextBasedScaleProviderFactory').ContextBasedScaleProviderFactory;
exports.FixedScaleProvider = require('./lib/scaling/FixedScaleProvider').FixedScaleProvider;
exports.FixedScaleProviderFactory = require('./lib/scaling/FixedScaleProviderFactory').FixedScaleProviderFactory;
exports.NullScaleProvider = require('./lib/scaling/NullScaleProvider').NullScaleProvider;
exports.ScaleProvider = require('./lib/scaling/ScaleProvider').ScaleProvider;
exports.ScaleProviderFactory = require('./lib/scaling/ScaleProviderFactory').ScaleProviderFactory;
exports.ScaleProviderIdentityFactory = require('./lib/scaling/ScaleProviderIdentityFactory').ScaleProviderIdentityFactory;

exports.PropertyData = require('./lib/server/PropertyData').PropertyData;
exports.ProxySettings = require('./lib/server/ProxySettings').ProxySettings;
exports.RunningSession = require('./lib/server/RunningSession').RunningSession;
exports.ServerConnector = require('./lib/server/ServerConnector').ServerConnector;
exports.SessionStartInfo = require('./lib/server/SessionStartInfo').SessionStartInfo;
exports.SessionType = require('./lib/server/SessionType').SessionType;

exports.MouseTrigger = require('./lib/triggers/MouseTrigger').MouseTrigger;
exports.TextTrigger = require('./lib/triggers/TextTrigger').TextTrigger;
exports.Trigger = require('./lib/triggers/Trigger').Trigger;

exports.BrowserNames = require('./lib/utils/BrowserNames').BrowserNames;
exports.GeneralUtils = require('./lib/utils/GeneralUtils').GeneralUtils;
exports.OSNames = require('./lib/utils/OSNames').OSNames;
exports.PropertyHandler = require('./lib/utils/PropertyHandler').PropertyHandler;
exports.ReadOnlyPropertyHandler = require('./lib/utils/ReadOnlyPropertyHandler').ReadOnlyPropertyHandler;
exports.SimplePropertyHandler = require('./lib/utils/SimplePropertyHandler').SimplePropertyHandler;
exports.StreamUtils = require('./lib/utils/StreamUtils').ReadableBufferStream;
exports.TestResultsFormatter = require('./lib/utils/TestResultsFormatter').TestResultsFormatter;
exports.UserAgent = require('./lib/utils/UserAgent').UserAgent;

exports.ArgumentGuard = require('./lib/ArgumentGuard').ArgumentGuard;
exports.AppEnvironment = require('./lib/AppEnvironment').AppEnvironment;
exports.BatchInfo = require('./lib/BatchInfo').BatchInfo;
exports.EyesBase = require('./lib/EyesBase').EyesBase;
exports.EyesJsBrowserUtils = require('./lib/EyesJsBrowserUtils').EyesJsBrowserUtils;
exports.EyesJsExecutor = require('./lib/EyesJsExecutor').EyesJsExecutor;
exports.FailureReports = require('./lib/FailureReports').FailureReports;
exports.MatchSingleWindowTask = require('./lib/MatchSingleWindowTask').MatchSingleWindowTask;
exports.MatchWindowTask = require('./lib/MatchWindowTask').MatchWindowTask;
exports.RenderWindowTask = require('./lib/RenderWindowTask').RenderWindowTask;
exports.TestResults = require('./lib/TestResults').TestResults;
exports.TestResultsStatus = require('./lib/TestResultsStatus').TestResultsStatus;
