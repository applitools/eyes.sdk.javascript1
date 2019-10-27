'use strict';

/* eslint-disable max-len */

// config
exports.AccessibilityLevel = require('./lib/config/AccessibilityLevel').AccessibilityLevel;
exports.AccessibilityMatchSettings = require('./lib/config/AccessibilityMatchSettings').AccessibilityMatchSettings;
exports.AccessibilityRegionType = require('./lib/config/AccessibilityRegionType').AccessibilityRegionType;
exports.BatchInfo = require('./lib/config/BatchInfo').BatchInfo;
exports.BrowserType = require('./lib/config/BrowserType').BrowserType;
exports.Configuration = require('./lib/config/Configuration').Configuration;
exports.DeviceName = require('./lib/config/DeviceName').DeviceName;
exports.ExactMatchSettings = require('./lib/config/ExactMatchSettings').ExactMatchSettings;
exports.FloatingMatchSettings = require('./lib/config/FloatingMatchSettings').FloatingMatchSettings;
exports.ImageMatchSettings = require('./lib/config/ImageMatchSettings').ImageMatchSettings;
exports.MatchLevel = require('./lib/config/MatchLevel').MatchLevel;
exports.PropertyData = require('./lib/config/PropertyData').PropertyData;
exports.ProxySettings = require('./lib/config/ProxySettings').ProxySettings;
exports.ScreenOrientation = require('./lib/config/ScreenOrientation').ScreenOrientation;
exports.StitchMode = require('./lib/config/StitchMode').StitchMode;

// debug
exports.DebugScreenshotsProvider = require('./lib/debug/DebugScreenshotsProvider').DebugScreenshotsProvider;
exports.FileDebugScreenshotsProvider = require('./lib/debug/FileDebugScreenshotsProvider').FileDebugScreenshotsProvider;
exports.NullDebugScreenshotProvider = require('./lib/debug/NullDebugScreenshotProvider').NullDebugScreenshotProvider;

// errors
exports.EyesError = require('./lib/errors/EyesError').EyesError;

// geometry
exports.CoordinatesType = require('./lib/geometry/CoordinatesType').CoordinatesType;
exports.Location = require('./lib/geometry/Location').Location;
exports.RectangleSize = require('./lib/geometry/RectangleSize').RectangleSize;
exports.Region = require('./lib/geometry/Region').Region;

// handler
exports.PropertyHandler = require('./lib/handler/PropertyHandler').PropertyHandler;
exports.ReadOnlyPropertyHandler = require('./lib/handler/ReadOnlyPropertyHandler').ReadOnlyPropertyHandler;
exports.SimplePropertyHandler = require('./lib/handler/SimplePropertyHandler').SimplePropertyHandler;

// images
exports.ImageDeltaCompressor = require('./lib/images/ImageDeltaCompressor').ImageDeltaCompressor;
exports.MutableImage = require('./lib/images/MutableImage').MutableImage;

// logging
exports.ConsoleLogHandler = require('./lib/logging/ConsoleLogHandler').ConsoleLogHandler;
exports.DebugLogHandler = require('./lib/logging/DebugLogHandler').DebugLogHandler;
exports.FileLogHandler = require('./lib/logging/FileLogHandler').FileLogHandler; // -browser
exports.Logger = require('./lib/logging/Logger').Logger;
exports.LogHandler = require('./lib/logging/LogHandler').LogHandler;
exports.NullLogHandler = require('./lib/logging/NullLogHandler').NullLogHandler;

// useragent
exports.BrowserNames = require('./lib/useragent/BrowserNames').BrowserNames;
exports.OSNames = require('./lib/useragent/OSNames').OSNames;
exports.UserAgent = require('./lib/useragent/UserAgent').UserAgent;

// utils
exports.ArgumentGuard = require('./lib/utils/ArgumentGuard').ArgumentGuard;
exports.ConfigUtils = require('./lib/utils/ConfigUtils').ConfigUtils;
exports.DateTimeUtils = require('./lib/utils/DateTimeUtils').DateTimeUtils;
exports.FileUtils = require('./lib/utils/FileUtils').FileUtils;
exports.GeneralUtils = require('./lib/utils/GeneralUtils').GeneralUtils;
exports.ImageUtils = require('./lib/utils/ImageUtils').ImageUtils;
exports.PerformanceUtils = require('./lib/utils/PerformanceUtils').PerformanceUtils;
exports.StreamUtils = require('./lib/utils/StreamUtils');
exports.TypeUtils = require('./lib/utils/TypeUtils').TypeUtils;
