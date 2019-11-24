'use strict';

const assert = require('assert');

const { UserAgent, OSNames, BrowserNames } = require('../../../index');

describe('UserAgent', () => {
  describe('#parseUserAgentString()', () => {
    it('should return Chrome as browser, Windows as OS', () => {
      const uaString = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36';
      const userAgent = UserAgent.parseUserAgentString(uaString, true);
      assert.strictEqual(userAgent.getOS(), 'Windows');
      assert.strictEqual(userAgent.getOSMajorVersion(), '10');
      assert.strictEqual(userAgent.getOSMinorVersion(), '0');
      assert.strictEqual(userAgent.getBrowser(), 'Chrome');
      assert.strictEqual(userAgent.getBrowserMajorVersion(), '60');
      assert.strictEqual(userAgent.getBrowserMinorVersion(), '0');
    });

    it('should return Firefox as browser, Windows as OS', () => {
      const uaString = 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0';
      const userAgent = UserAgent.parseUserAgentString(uaString, true);
      assert.strictEqual(userAgent.getOS(), 'Windows');
      assert.strictEqual(userAgent.getOSMajorVersion(), '10');
      assert.strictEqual(userAgent.getOSMinorVersion(), '0');
      assert.strictEqual(userAgent.getBrowser(), 'Firefox');
      assert.strictEqual(userAgent.getBrowserMajorVersion(), '54');
      assert.strictEqual(userAgent.getBrowserMinorVersion(), '0');
    });

    it('should return Chrome as browser, Android as OS', () => {
      const uaString = 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Mobile Safari/537.36';
      const userAgent = UserAgent.parseUserAgentString(uaString, true);
      assert.strictEqual(userAgent.getOS(), 'Android');
      assert.strictEqual(userAgent.getOSMajorVersion(), '6');
      assert.strictEqual(userAgent.getOSMinorVersion(), '0');
      assert.strictEqual(userAgent.getBrowser(), 'Chrome');
      assert.strictEqual(userAgent.getBrowserMajorVersion(), '60');
      assert.strictEqual(userAgent.getBrowserMinorVersion(), '0');
    });

    it('should return Safari as browser, IOS as OS', () => {
      const uaString = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1';
      const userAgent = UserAgent.parseUserAgentString(uaString, true);
      assert.strictEqual(userAgent.getOS(), 'IOS');
      assert.strictEqual(userAgent.getOSMajorVersion(), '10');
      assert.strictEqual(userAgent.getOSMinorVersion(), '3');
      assert.strictEqual(userAgent.getBrowser(), 'Safari');
      assert.strictEqual(userAgent.getBrowserMajorVersion(), '602');
      assert.strictEqual(userAgent.getBrowserMinorVersion(), '1');
    });

    it('should return Chrome as browser, Linux as OS', () => {
      const uaString = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36 OPR/38.0.2220.41';
      const userAgent = UserAgent.parseUserAgentString(uaString, true);
      assert.strictEqual(userAgent.getOS(), 'Linux');
      assert.strictEqual(userAgent.getOSMajorVersion(), undefined);
      assert.strictEqual(userAgent.getOSMinorVersion(), undefined);
      assert.strictEqual(userAgent.getBrowser(), 'Chrome');
      assert.strictEqual(userAgent.getBrowserMajorVersion(), '51');
      assert.strictEqual(userAgent.getBrowserMinorVersion(), '0');
    });

    it('should return Edge as browser, Windows as OS', () => {
      const uaString = 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10136';
      const userAgent = UserAgent.parseUserAgentString(uaString, true);
      assert.strictEqual(userAgent.getOS(), 'Windows');
      assert.strictEqual(userAgent.getOSMajorVersion(), '10');
      assert.strictEqual(userAgent.getOSMinorVersion(), '0');
      assert.strictEqual(userAgent.getBrowser(), 'Edge');
      assert.strictEqual(userAgent.getBrowserMajorVersion(), '12');
      assert.strictEqual(userAgent.getBrowserMinorVersion(), '10136');
    });

    it('should return IE as browser, Windows as OS', () => {
      const uaString = 'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)';
      const userAgent = UserAgent.parseUserAgentString(uaString, true);
      assert.strictEqual(userAgent.getOS(), 'Windows');
      assert.strictEqual(userAgent.getOSMajorVersion(), undefined);
      assert.strictEqual(userAgent.getOSMinorVersion(), undefined);
      assert.strictEqual(userAgent.getBrowser(), 'IE');
      assert.strictEqual(userAgent.getBrowserMajorVersion(), '9');
      assert.strictEqual(userAgent.getBrowserMinorVersion(), '0');
    });

    it('should return hidden IE as browser, Windows as OS', () => {
      const uaString = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
      const userAgent = UserAgent.parseUserAgentString(uaString, true);
      assert.strictEqual(userAgent.getOS(), 'Windows');
      assert.strictEqual(userAgent.getOSMajorVersion(), '6');
      assert.strictEqual(userAgent.getOSMinorVersion(), '3');
      assert.strictEqual(userAgent.getBrowser(), 'IE');
      assert.strictEqual(userAgent.getBrowserMajorVersion(), '11');
      assert.strictEqual(userAgent.getBrowserMinorVersion(), '0');
    });

    it('should return Unknown as browser, Unknown as OS', () => {
      const uaString = 'Googlebot/2.1 (+http://www.google.com/bot.html)';
      const userAgent = UserAgent.parseUserAgentString(uaString, true);
      assert.strictEqual(userAgent.getOS(), 'Unknown');
      assert.strictEqual(userAgent.getOSMajorVersion(), undefined);
      assert.strictEqual(userAgent.getOSMinorVersion(), undefined);
      assert.strictEqual(userAgent.getBrowser(), 'Unknown');
      assert.strictEqual(userAgent.getBrowserMajorVersion(), undefined);
      assert.strictEqual(userAgent.getBrowserMinorVersion(), undefined);
    });

    it('should return Safari as browser, Mac OS X as OS', () => {
      const uaString = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/604.3.5 (KHTML, like Gecko) Version/11.0.1 Safari/604.3.5';
      const userAgent = UserAgent.parseUserAgentString(uaString, true);
      assert.strictEqual(userAgent.getOS(), 'Macintosh');
      assert.strictEqual(userAgent.getOSMajorVersion(), '10');
      assert.strictEqual(userAgent.getOSMinorVersion(), '13');
      assert.strictEqual(userAgent.getBrowser(), 'Safari');
      assert.strictEqual(userAgent.getBrowserMajorVersion(), '11');
      assert.strictEqual(userAgent.getBrowserMinorVersion(), '0');
    });

    [
      {
        uaStr: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
        expectedOs: OSNames.Windows,
        expectedOsMajorVersion: '10',
        expectedOsMinorVersion: '0',
        expectedBrowser: BrowserNames.Chrome,
        expectedBrowserMajorVersion: '75',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (Linux; Android 9; Android SDK built for x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.105 Mobile Safari/537.36',
        expectedOs: OSNames.Android,
        expectedOsMajorVersion: '9',
        expectedOsMinorVersion: '0',
        expectedBrowser: BrowserNames.Chrome,
        expectedBrowserMajorVersion: '72',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0',
        expectedOs: OSNames.Windows,
        expectedOsMajorVersion: '7',
        expectedOsMinorVersion: '0',
        expectedBrowser: BrowserNames.Firefox,
        expectedBrowserMajorVersion: '54',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
        expectedOs: OSNames.Windows,
        expectedOsMajorVersion: '7',
        expectedOsMinorVersion: '0',
        expectedBrowser: BrowserNames.IE,
        expectedBrowserMajorVersion: '11',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)',
        expectedOs: OSNames.Windows,
        expectedOsMajorVersion: '7',
        expectedOsMinorVersion: '0',
        expectedBrowser: BrowserNames.IE,
        expectedBrowserMajorVersion: '10',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/74.0.3729.157 Safari/537.36',
        expectedOs: OSNames.Linux,
        expectedOsMajorVersion: '',
        expectedOsMinorVersion: '',
        expectedBrowser: BrowserNames.Chrome,
        expectedBrowserMajorVersion: '74',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0',
        expectedOs: OSNames.Linux,
        expectedOsMajorVersion: '',
        expectedOsMinorVersion: '',
        expectedBrowser: BrowserNames.Firefox,
        expectedBrowserMajorVersion: '50',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (Linux; Android 6.0.1; SM-J700M Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36',
        expectedOs: OSNames.Android,
        expectedOsMajorVersion: '6',
        expectedOsMinorVersion: '0',
        expectedBrowser: BrowserNames.Chrome,
        expectedBrowserMajorVersion: '69',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
        expectedOs: OSNames.IOS,
        expectedOsMajorVersion: '12',
        expectedOsMinorVersion: '1',
        expectedBrowser: BrowserNames.Safari,
        expectedBrowserMajorVersion: '12',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (iPad; CPU OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1',
        expectedOs: OSNames.IOS,
        expectedOsMajorVersion: '11',
        expectedOsMinorVersion: '3',
        expectedBrowser: BrowserNames.Safari,
        expectedBrowserMajorVersion: '11',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.1 Safari/605.1.15',
        expectedOs: OSNames.MacOSX,
        expectedOsMajorVersion: '10',
        expectedOsMinorVersion: '14',
        expectedBrowser: BrowserNames.Safari,
        expectedBrowserMajorVersion: '12',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
        expectedOs: OSNames.Windows,
        expectedOsMajorVersion: '10',
        expectedOsMinorVersion: '0',
        expectedBrowser: BrowserNames.Chrome,
        expectedBrowserMajorVersion: '74',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.117 Safari/537.36',
        expectedOs: OSNames.Windows,
        expectedOsMajorVersion: '7',
        expectedOsMinorVersion: '0',
        expectedBrowser: BrowserNames.Chrome,
        expectedBrowserMajorVersion: '33',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
        expectedOs: OSNames.Windows,
        expectedOsMajorVersion: '6',
        expectedOsMinorVersion: '3',
        expectedBrowser: BrowserNames.Chrome,
        expectedBrowserMajorVersion: '60',
        expectedBrowserMinorVersion: '0',
      },
      /*
       {
       uaStr: 'Mozilla/5.0 (Linux; U; Android 4.2.2; en-us; GT-I9100 Build/JDQ39E) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 CyanogenMod/10.1.3/i9100',
       expectedOs: OSNames.Android,
       expectedOsMajorVersion: '4',
       expectedOsMinorVersion: '2',
       expectedBrowser: BrowserNames.AndroidBrowser,
       expectedBrowserMajorVersion: '4',
       expectedBrowserMinorVersion: '0',
       },
       {
       uaStr: 'Mozilla/4.0 (compatible; MSIE 7.0b; Windows NT 6.0)',
       expectedOs: OSNames.Windows,
       expectedOsMajorVersion: '6',
       expectedOsMinorVersion: '0',
       expectedBrowser: BrowserNames.IE,
       expectedBrowserMajorVersion: '7',
       expectedBrowserMinorVersion: '0b',
       },
       */
      {
        uaStr: 'Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25',
        expectedOs: OSNames.IOS,
        expectedOsMajorVersion: '6',
        expectedOsMinorVersion: '0',
        expectedBrowser: BrowserNames.Safari,
        expectedBrowserMajorVersion: '6',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (iPad; CPU OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko ) Version/5.1 Mobile/9B176 Safari/7534.48.3',
        expectedOs: OSNames.IOS,
        expectedOsMajorVersion: '5',
        expectedOsMinorVersion: '1',
        expectedBrowser: BrowserNames.Safari,
        expectedBrowserMajorVersion: '5',
        expectedBrowserMinorVersion: '1',
      },
      {
        uaStr: 'Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3_3 like Mac OS X; ja-jp) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5',
        expectedOs: OSNames.IOS,
        expectedOsMajorVersion: '4',
        expectedOsMinorVersion: '3',
        expectedBrowser: BrowserNames.Safari,
        expectedBrowserMajorVersion: '5',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (iPhone Simulator; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7D11 Safari/531.21.10',
        expectedOs: OSNames.IOS,
        expectedOsMajorVersion: '3',
        expectedOsMinorVersion: '2',
        expectedBrowser: BrowserNames.Safari,
        expectedBrowserMajorVersion: '4',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0',
        expectedOs: OSNames.Windows,
        expectedOsMajorVersion: '7',
        expectedOsMinorVersion: '0',
        expectedBrowser: BrowserNames.Firefox,
        expectedBrowserMajorVersion: '54',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
        expectedOs: OSNames.Windows,
        expectedOsMajorVersion: '7',
        expectedOsMinorVersion: '0',
        expectedBrowser: BrowserNames.IE,
        expectedBrowserMajorVersion: '11',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)',
        expectedOs: OSNames.Windows,
        expectedOsMajorVersion: '7',
        expectedOsMinorVersion: '0',
        expectedBrowser: BrowserNames.IE,
        expectedBrowserMajorVersion: '10',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/74.0.3729.157 Safari/537.36',
        expectedOs: OSNames.Linux,
        expectedOsMajorVersion: '',
        expectedOsMinorVersion: '',
        expectedBrowser: BrowserNames.Chrome,
        expectedBrowserMajorVersion: '74',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0',
        expectedOs: OSNames.Linux,
        expectedOsMajorVersion: '',
        expectedOsMinorVersion: '',
        expectedBrowser: BrowserNames.Firefox,
        expectedBrowserMajorVersion: '50',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (Linux; Android 6.0.1; SM-J700M Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36',
        expectedOs: OSNames.Android,
        expectedOsMajorVersion: '6',
        expectedOsMinorVersion: '0',
        expectedBrowser: BrowserNames.Chrome,
        expectedBrowserMajorVersion: '69',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
        expectedOs: OSNames.IOS,
        expectedOsMajorVersion: '12',
        expectedOsMinorVersion: '1',
        expectedBrowser: BrowserNames.Safari,
        expectedBrowserMajorVersion: '12',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (iPad; CPU OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1',
        expectedOs: OSNames.IOS,
        expectedOsMajorVersion: '11',
        expectedOsMinorVersion: '3',
        expectedBrowser: BrowserNames.Safari,
        expectedBrowserMajorVersion: '11',
        expectedBrowserMinorVersion: '0',
      },
      {
        uaStr: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.1 Safari/605.1.15',
        expectedOs: OSNames.MacOSX,
        expectedOsMajorVersion: '10',
        expectedOsMinorVersion: '14',
        expectedBrowser: BrowserNames.Safari,
        expectedBrowserMajorVersion: '12',
        expectedBrowserMinorVersion: '0',
      },
    ].forEach(({ uaStr, expectedOs, expectedOsMajorVersion, expectedOsMinorVersion, expectedBrowser, expectedBrowserMajorVersion, expectedBrowserMinorVersion }) => {
      it(`should parse ${uaStr}`, () => {
        const userAgent = UserAgent.parseUserAgentString(uaStr, true);
        assert.strictEqual(userAgent.getOS(), expectedOs);
        assert.strictEqual(userAgent.getOSMajorVersion(), expectedOsMajorVersion);
        assert.strictEqual(userAgent.getOSMinorVersion(), expectedOsMinorVersion);
        assert.strictEqual(userAgent.getBrowser(), expectedBrowser);
        assert.strictEqual(userAgent.getBrowserMajorVersion(), expectedBrowserMajorVersion);
        assert.strictEqual(userAgent.getBrowserMinorVersion(), expectedBrowserMinorVersion);
      });
    });
  });
});
