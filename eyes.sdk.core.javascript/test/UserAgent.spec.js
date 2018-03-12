const {describe, it} = require("mocha");
const assert = require("assert");

const UserAgent = require("../src/utils/UserAgent");

describe('UserAgent', () => {
    describe('#parseUserAgentString()', () => {
        it('should return Chrome as browser, Windows as OS', () => {
            const uaString = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36";
            const userAgent = UserAgent.parseUserAgentString(uaString, true);
            assert.equal(userAgent.getOS(), "Windows");
            assert.equal(userAgent.getOSMajorVersion(), "10");
            assert.equal(userAgent.getOSMinorVersion(), "0");
            assert.equal(userAgent.getBrowser(), "Chrome");
            assert.equal(userAgent.getBrowserMajorVersion(), "60");
            assert.equal(userAgent.getBrowserMinorVersion(), "0");
        });

        it('should return Firefox as browser, Windows as OS', () => {
            const uaString = "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0";
            const userAgent = UserAgent.parseUserAgentString(uaString, true);
            assert.equal(userAgent.getOS(), "Windows");
            assert.equal(userAgent.getOSMajorVersion(), "10");
            assert.equal(userAgent.getOSMinorVersion(), "0");
            assert.equal(userAgent.getBrowser(), "Firefox");
            assert.equal(userAgent.getBrowserMajorVersion(), "54");
            assert.equal(userAgent.getBrowserMinorVersion(), "0");
        });

        it('should return Chrome as browser, Android as OS', () => {
            const uaString = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Mobile Safari/537.36";
            const userAgent = UserAgent.parseUserAgentString(uaString, true);
            assert.equal(userAgent.getOS(), "Android");
            assert.equal(userAgent.getOSMajorVersion(), "6");
            assert.equal(userAgent.getOSMinorVersion(), "0");
            assert.equal(userAgent.getBrowser(), "Chrome");
            assert.equal(userAgent.getBrowserMajorVersion(), "60");
            assert.equal(userAgent.getBrowserMinorVersion(), "0");
        });

        it('should return Safari as browser, IOS as OS', () => {
            const uaString = "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1";
            const userAgent = UserAgent.parseUserAgentString(uaString, true);
            assert.equal(userAgent.getOS(), "IOS");
            assert.equal(userAgent.getOSMajorVersion(), "10");
            assert.equal(userAgent.getOSMinorVersion(), "3");
            assert.equal(userAgent.getBrowser(), "Safari");
            assert.equal(userAgent.getBrowserMajorVersion(), "602");
            assert.equal(userAgent.getBrowserMinorVersion(), "1");
        });

        it('should return Chrome as browser, Linux as OS', () => {
            const uaString = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36 OPR/38.0.2220.41";
            const userAgent = UserAgent.parseUserAgentString(uaString, true);
            assert.equal(userAgent.getOS(), "Linux");
            assert.equal(userAgent.getOSMajorVersion(), undefined);
            assert.equal(userAgent.getOSMinorVersion(), undefined);
            assert.equal(userAgent.getBrowser(), "Chrome");
            assert.equal(userAgent.getBrowserMajorVersion(), "51");
            assert.equal(userAgent.getBrowserMinorVersion(), "0");
        });

        it('should return IE as browser, Windows as OS', () => {
            const uaString = "Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)";
            const userAgent = UserAgent.parseUserAgentString(uaString, true);
            assert.equal(userAgent.getOS(), "Windows");
            assert.equal(userAgent.getOSMajorVersion(), undefined);
            assert.equal(userAgent.getOSMinorVersion(), undefined);
            assert.equal(userAgent.getBrowser(), "IE");
            assert.equal(userAgent.getBrowserMajorVersion(), "9");
            assert.equal(userAgent.getBrowserMinorVersion(), "0");
        });

        it('should return Unknown as browser, Unknown as OS', () => {
            const uaString = "Googlebot/2.1 (+http://www.google.com/bot.html)";
            const userAgent = UserAgent.parseUserAgentString(uaString, true);
            assert.equal(userAgent.getOS(), "Unknown");
            assert.equal(userAgent.getOSMajorVersion(), undefined);
            assert.equal(userAgent.getOSMinorVersion(), undefined);
            assert.equal(userAgent.getBrowser(), "Unknown");
            assert.equal(userAgent.getBrowserMajorVersion(), undefined);
            assert.equal(userAgent.getBrowserMinorVersion(), undefined);
        });
    });
});
