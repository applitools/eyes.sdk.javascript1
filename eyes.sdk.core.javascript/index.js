exports.AppOutputProvider = require('./src/capture/AppOutputProvider');
exports.AppOutputWithScreenshot = require('./src/capture/AppOutputWithScreenshot');
exports.EyesScreenshot = require('./src/capture/EyesScreenshot');
exports.EyesScreenshotFactory = require('./src/capture/EyesScreenshotFactory');
exports.EyesSimpleScreenshot = require('./src/capture/EyesSimpleScreenshot');
exports.ImageProvider = require('./src/capture/ImageProvider');

exports.CutProvider = require('./src/cropping/CutProvider');
exports.FixedCutProvider = require('./src/cropping/FixedCutProvider');
exports.NullCutProvider = require('./src/cropping/NullCutProvider');
exports.UnscaledFixedCutProvider = require('./src/cropping/UnscaledFixedCutProvider');

exports.DebugScreenshotsProvider = require('./src/debug/DebugScreenshotsProvider');
exports.FileDebugScreenshotsProvider = require('./src/debug/FileDebugScreenshotsProvider');
exports.NullDebugScreenshotProvider = require('./src/debug/NullDebugScreenshotProvider');

exports.CoordinatesTypeConversionError = require('./src/errors/CoordinatesTypeConversionError');
exports.DiffsFoundError = require('./src/errors/DiffsFoundError');
exports.EyesError = require('./src/errors/EyesError');
exports.NewTestError = require('./src/errors/NewTestError');
exports.OutOfBoundsError = require('./src/errors/OutOfBoundsError');
exports.TestFailedError = require('./src/errors/TestFailedError');

exports.CheckSettings = require('./src/fluent/CheckSettings');
exports.CheckTarget = require('./src/fluent/CheckTarget');
exports.FloatingRegionByRectangle = require('./src/fluent/FloatingRegionByRectangle');
exports.GetFloatingRegion = require('./src/fluent/GetFloatingRegion');
exports.GetRegion = require('./src/fluent/GetRegion');
exports.IgnoreRegionByRectangle = require('./src/fluent/IgnoreRegionByRectangle');

exports.CoordinatesType = require('./src/geometry/CoordinatesType');
exports.Location = require('./src/geometry/Location');
exports.RectangleSize = require('./src/geometry/RectangleSize');
exports.Region = require('./src/geometry/Region');

exports.ImageDeltaCompressor = require('./src/images/ImageDeltaCompressor');
exports.ImageUtils = require('./src/images/ImageUtils');
exports.MutableImage = require('./src/images/MutableImage');

exports.ConsoleLogHandler = require('./src/logging/ConsoleLogHandler');
exports.FileLogHandler = require('./src/logging/FileLogHandler');
exports.Logger = require('./src/logging/Logger');
exports.LogHandler = require('./src/logging/LogHandler');
exports.NullLogHandler = require('./src/logging/NullLogHandler');

exports.AppOutput = require('./src/match/AppOutput');
exports.ExactMatchSettings = require('./src/match/ExactMatchSettings');
exports.FloatingMatchSettings = require('./src/match/FloatingMatchSettings');
exports.ImageMatchSettings = require('./src/match/ImageMatchSettings');
exports.MatchLevel = require('./src/match/MatchLevel');
exports.MatchResult = require('./src/match/MatchResult');
exports.MatchSingleWindowData = require('./src/match/MatchSingleWindowData');
exports.MatchWindowData = require('./src/match/MatchWindowData');
exports.MatchWindowDataWithScreenshot = require('./src/match/MatchWindowDataWithScreenshot');

exports.ActualAppOutput = require('./src/metadata/ActualAppOutput');
exports.Annotations = require('./src/metadata/Annotations');
exports.BatchInfo = require('./src/metadata/BatchInfo');
exports.Branch = require('./src/metadata/Branch');
exports.ExpectedAppOutput = require('./src/metadata/ExpectedAppOutput');
exports.Image = require('./src/metadata/Image');
exports.ImageMatchSettings = require('./src/metadata/ImageMatchSettings');
exports.SessionResults = require('./src/metadata/SessionResults');
exports.StartInfo = require('./src/metadata/StartInfo');

exports.InvalidPositionProvider = require('./src/positioning/InvalidPositionProvider');
exports.NullRegionProvider = require('./src/positioning/NullRegionProvider');
exports.PositionMemento = require('./src/positioning/PositionMemento');
exports.PositionProvider = require('./src/positioning/PositionProvider');
exports.RegionProvider = require('./src/positioning/RegionProvider');

exports.RenderingInfo = require('./src/renderer/RenderingInfo');
exports.RenderRequest = require('./src/renderer/RenderRequest');
exports.RenderStatus = require('./src/renderer/RenderStatus');
exports.RenderStatusResults = require('./src/renderer/RenderStatusResults');
exports.RGridDom = require('./src/renderer/RGridDom');
exports.RGridResource = require('./src/renderer/RGridResource');
exports.RunningRender = require('./src/renderer/RunningRender');

exports.ContextBasedScaleProvider = require('./src/scaling/ContextBasedScaleProvider');
exports.ContextBasedScaleProviderFactory = require('./src/scaling/ContextBasedScaleProviderFactory');
exports.FixedScaleProvider = require('./src/scaling/FixedScaleProvider');
exports.FixedScaleProviderFactory = require('./src/scaling/FixedScaleProviderFactory');
exports.NullScaleProvider = require('./src/scaling/NullScaleProvider');
exports.ScaleProvider = require('./src/scaling/ScaleProvider');
exports.ScaleProviderFactory = require('./src/scaling/ScaleProviderFactory');
exports.ScaleProviderIdentityFactory = require('./src/scaling/ScaleProviderIdentityFactory');

exports.PropertyData = require('./src/server/PropertyData');
exports.ProxySettings = require('./src/server/ProxySettings');
exports.RunningSession = require('./src/server/RunningSession');
exports.ServerConnector = require('./src/server/ServerConnector');
exports.SessionStartInfo = require('./src/server/SessionStartInfo');
exports.SessionType = require('./src/server/SessionType');

exports.MouseTrigger = require('./src/triggers/MouseTrigger');
exports.TextTrigger = require('./src/triggers/TextTrigger');
exports.Trigger = require('./src/triggers/Trigger');

exports.BrowserNames = require('./src/utils/BrowserNames');
exports.GeneralUtils = require('./src/utils/GeneralUtils');
exports.OSNames = require('./src/utils/OSNames');
exports.PropertyHandler = require('./src/utils/PropertyHandler');
exports.ReadOnlyPropertyHandler = require('./src/utils/ReadOnlyPropertyHandler');
exports.SimplePropertyHandler = require('./src/utils/SimplePropertyHandler');
exports.StreamUtils = require('./src/utils/StreamUtils');
exports.UserAgent = require('./src/utils/UserAgent');

exports.AppEnvironment = require('./src/AppEnvironment');
exports.ArgumentGuard = require('./src/ArgumentGuard');
exports.BatchInfo = require('./src/BatchInfo');
exports.EyesBase = require('./src/EyesBase');
exports.EyesJsBrowserUtils = require('./src/EyesJsBrowserUtils');
exports.EyesJsExecutor = require('./src/EyesJsExecutor');
exports.FailureReports = require('./src/FailureReports');
exports.MatchSingleWindowTask = require('./src/MatchSingleWindowTask');
exports.MatchWindowTask = require('./src/MatchWindowTask');
exports.PromiseFactory = require('./src/PromiseFactory');
exports.RemoteSessionEventHandler = require('./src/RemoteSessionEventHandler');
exports.RenderWindowTask = require('./src/RenderWindowTask');
exports.SessionEventHandler = require('./src/SessionEventHandler');
exports.TestResults = require('./src/TestResults');
exports.TestResultsStatus = require('./src/TestResultsStatus');
