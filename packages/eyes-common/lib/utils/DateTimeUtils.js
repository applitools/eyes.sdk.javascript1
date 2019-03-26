'use strict';

const dateFormat = require('dateformat');

const DATE_FORMAT_ISO8601 = "yyyy-mm-dd'T'HH:MM:ss'Z'";
const DATE_FORMAT_RFC1123 = "ddd, dd mmm yyyy HH:MM:ss 'GMT'";
const DATE_FORMAT_LOGFILE = 'yyyy_mm_dd_HH_MM_ss_l';

/**
 * @ignore
 */
class DateTimeUtils {
  /**
   * Convert a Date object to a ISO-8601 date string
   *
   * @param {Date} [date] - Date which will be converted
   * @return {string} - string formatted as ISO-8601 (yyyy-MM-dd'T'HH:mm:ss'Z')
   */
  static toISO8601DateTime(date = new Date()) {
    return dateFormat(date, DATE_FORMAT_ISO8601, true);
  }

  /**
   * Convert a Date object to a RFC-1123 date string
   *
   * @param {Date} [date] - Date which will be converted
   * @return {string} - string formatted as RFC-1123 (E, dd MMM yyyy HH:mm:ss 'GMT')
   */
  static toRfc1123DateTime(date = new Date()) {
    return dateFormat(date, DATE_FORMAT_RFC1123, true);
  }

  /**
   * Convert a Date object to a RFC-1123 date string
   *
   * @param {Date} [date] - Date which will be converted
   * @param {boolean} [utc=false] - If set to true, then will be used uct time instead of local
   * @return {string} - string formatted as RFC-1123 (E, dd MMM yyyy HH:mm:ss 'GMT')
   */
  static toLogFileDateTime(date = new Date(), utc = false) {
    return dateFormat(date, DATE_FORMAT_LOGFILE, utc);
  }

  /**
   * Creates {@link Date} instance from an ISO 8601 formatted string.
   *
   * @param {string} dateTime - An ISO 8601 formatted string.
   * @return {Date} - A {@link Date} instance representing the given date and time.
   */
  static fromISO8601DateTime(dateTime) {
    return new Date(dateTime);
  }
}

exports.DateTimeUtils = DateTimeUtils;
