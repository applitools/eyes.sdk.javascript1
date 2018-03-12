const assert = require("assert");

const GeneralUtils = require("../src/utils/GeneralUtils");

describe('GeneralUtils', function(){
    describe('urlConcat()', function(){
        it('should return / when the values are empty', function() {
            assert.equal(GeneralUtils.urlConcat('', ''), "/");
        });
        it('should return the correct Url when both parts don\'t start/end with a "/"', function () {
            const left = "http://www.applitools.com",
                right = "subdomain/index.html";
            assert.equal(GeneralUtils.urlConcat(left, right), left + "/" + right);
        });
        it('should return the correct Url when only left part ends with a "/"', function () {
            const left = "http://www.applitools.com/",
                right = "subdomain/index.html";
            assert.equal(GeneralUtils.urlConcat(left, right), left + right);
        });
        it('should return the correct Url when only right part starts with a "/"', function () {
            const left = "http://www.applitools.com",
                right = "/subdomain/index.html";
            assert.equal(GeneralUtils.urlConcat(left, right), left + right);
        });
        it('should return the correct Url when both parts start/end with a "/"', function () {
            const left = "http://www.applitools.com",
                right = "/subdomain/index.html";
            assert.equal(GeneralUtils.urlConcat(left + "/", right), left + right);
        });
        it('should return the correct Url when given multiple suffixes', function () {
            assert.equal(GeneralUtils.urlConcat("http://www.applitools.com/", "/subdomain/", "/index.html"), "http://www.applitools.com/subdomain/index.html");
        });
        it('should return the correct Url when given multiple suffixes and query params', function () {
            assert.equal(GeneralUtils.urlConcat("http://www.applitools.com/", "/subdomain/", "?param=1"), "http://www.applitools.com/subdomain?param=1");
        });
    });

    describe('toISO8601DateTime()', function(){
        it('should return formatted string', function() {
            // noinspection MagicNumberJS
            const date = new Date(1520616682000);
            assert.equal(GeneralUtils.toISO8601DateTime(date), "2018-03-09T17:31:22Z");
        });
    });

    describe('toRfc1123DateTime()', function(){
        it('should return formatted string', function() {
            // noinspection MagicNumberJS
            const date = new Date(1520616682000);
            assert.equal(GeneralUtils.toRfc1123DateTime(date), "Fri, 09 Mar 2018 17:31:22 GMT");
        });
    });

    describe('fromISO8601DateTime()', function(){
        it('should return formatted string', function() {
            const input = "2018-03-09T17:31:22Z";
            // noinspection MagicNumberJS
            assert.equal(GeneralUtils.fromISO8601DateTime(input).getTime(), 1520616682000);
        });
    });

    describe('jwtDecode()', function(){
        it('decoded should be equal with original', function() {
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ";
            const decoded = GeneralUtils.jwtDecode(token);

            assert.equal(decoded.admin, true);
            assert.equal(decoded.name, "John Doe");
            assert.equal(decoded.sub, "1234567890");
        });
    });

    describe('elapsedString()', function(){
        it('should return correct amount of seconds', function() {
            assert.equal(GeneralUtils.elapsedString(6000), '6s 0ms');
        });

        it('should return correct amount of sec and ms', function() {
            assert.equal(GeneralUtils.elapsedString(6456), '6s 456ms');
        });

        it('should return correct amount of min, sec', function() {
            assert.equal(GeneralUtils.elapsedString(61000), '1m 1s 0ms');
        });

        it('should return correct amount of min, sec and ms', function() {
            assert.equal(GeneralUtils.elapsedString(156458), '2m 36s 458ms');
        });
    });
});
