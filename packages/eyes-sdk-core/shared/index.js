exports.deserializeDomSnapshotResult = require('../lib/utils/deserializeDomSnapshotResult')
exports.Logger = require('../lib/logging/Logger')

exports.DiffsFoundError = require('../lib/errors/DiffsFoundError')
exports.TestResults = require('../lib/TestResults')
exports.TestResultsError = require('../lib/TestResultsError')
exports.TestResultsStatus = require('../lib/TestResultsStatus')
exports.TestResultsFormatter = require('../lib/TestResultsFormatter')

exports.RectangleSize = require('../lib/geometry/RectangleSize')
exports.Location = require('../lib/geometry/Location')

exports.Region = require('../lib/geometry/Region')
exports.CheckSettings = require('../lib/fluent/CheckSettings')
exports.GetRegion = require('../lib/fluent/GetRegion')
exports.GetFloatingRegion = require('../lib/fluent/GetFloatingRegion')
exports.GetAccessibilityRegion = require('../lib/fluent/GetAccessibilityRegion')
exports.AccessibilityRegionType = require('../lib/config/AccessibilityRegionType')
exports.IgnoreRegionByRectangle = require('../lib/fluent/IgnoreRegionByRectangle')
exports.FloatingRegionByRectangle = require('../lib/fluent/FloatingRegionByRectangle')
exports.AccessibilityRegionByRectangle = require('../lib/fluent/AccessibilityRegionByRectangle')

exports.RenderInfo = require('../lib/renderer/RenderInfo')
exports.RenderingInfo = require('../lib/server/RenderingInfo')
exports.RenderRequest = require('../lib/renderer/RenderRequest')
exports.RenderStatus = require('../lib/renderer/RenderStatus')
exports.RenderStatusResults = require('../lib/renderer/RenderStatusResults')

exports.RGridResource = require('../lib/renderer/RGridResource')
exports.RGridDom = require('../lib/renderer/RGridDom')

exports.NullRegionProvider = require('../lib/positioning/NullRegionProvider')
exports.EyesBase = require('../lib/sdk/EyesBase')

exports.getTunnelAgentFromProxy = require('../lib/server/getTunnelAgentFromProxy')
exports.BatchInfo = require('../lib/config/BatchInfo')
exports.BrowserType = require('../lib/config/BrowserType')
exports.TypeUtils = require('../lib/utils/TypeUtils')
exports.GeneralUtils = require('../lib/utils/GeneralUtils')
exports.ConfigUtils = require('../lib/utils/ConfigUtils')

exports.RunnerStartedEvent = require('../lib/logging/RunnerStartedEvent')
exports.MatchResult = require('../lib/match/MatchResult')

exports.ProxySettings = require('../lib/config/ProxySettings')
