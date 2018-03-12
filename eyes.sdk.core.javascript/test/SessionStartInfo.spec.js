const assert = require("assert");

const AppEnvironment = require("../src/AppEnvironment");
const BatchInfo = require("../src/BatchInfo");
const SessionType = require("../src/server/SessionType");
const PropertyData = require("../src/server/PropertyData");
const SessionStartInfo = require("../src/server/SessionStartInfo");
const ImageMatchSettings = require("../src/match/ImageMatchSettings");

describe('SessionStartInfo', () => {
    it('toJSON()', () => {
        const properties = [];
        properties.push(new PropertyData("property name", "property value"));
        properties.push(new PropertyData(null, null));

        const batchInfo = new BatchInfo("batch name");

        const ssi = new SessionStartInfo(
            "some agent", SessionType.SEQUENTIAL,
            "my app", "1.0.0", "some scenario", batchInfo,
            "some baseline name", "env name", new AppEnvironment(), new ImageMatchSettings(),
            "some branch name", "some parent branch name", false, false, properties, false
        );

        const actualSerialization = JSON.stringify(ssi);
        const expectedSerialization = `{"agentId":"some agent","sessionType":"SEQUENTIAL","appIdOrName":"my app","verId":"1.0.0","scenarioIdOrName":"some scenario","batchInfo":${JSON.stringify(batchInfo)},"baselineEnvName":"some baseline name","environmentName":"env name","environment":{"inferred":null},"defaultMatchSettings":{"matchLevel":"Strict","ignore":[],"floating":[]},"branchName":"some branch name","parentBranchName":"some parent branch name","compareWithParentBranch":false,"ignoreBaseline":false,"properties":[{"name":"property name","value":"property value"},{"name":null,"value":null}],"render":false}`;
        assert.equal(actualSerialization, expectedSerialization, "SessionStartInfo serialization does not match!");
    });
});
