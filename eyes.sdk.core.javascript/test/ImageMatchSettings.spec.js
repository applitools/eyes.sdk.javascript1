const assert = require("assert");

const ImageMatchSettings = require("../src/match/ImageMatchSettings");

describe('ImageMatchSettings', () => {
    it('toJSON()', () => {
        const ims = new ImageMatchSettings();

        let actualSerialization = JSON.stringify(ims);
        let expectedSerialization = "{\"matchLevel\":\"Strict\",\"ignore\":[],\"floating\":[]}";
        assert.equal(expectedSerialization, actualSerialization, "ImageMatchSettings serialization does not match!");

        ims.setIgnoreCaret(true);
        actualSerialization = JSON.stringify(ims);
        expectedSerialization = "{\"matchLevel\":\"Strict\",\"ignoreCaret\":true,\"ignore\":[],\"floating\":[]}";
        assert.equal(expectedSerialization, actualSerialization, "ImageMatchSettings serialization does not match!");
    });
});
