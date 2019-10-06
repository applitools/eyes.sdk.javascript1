'use strict';

const assert = require('assert');

const {
  AppEnvironment,
  BatchInfo,
  SessionType,
  PropertyData,
  SessionStartInfo,
  ImageMatchSettings,
} = require('../../../index');

describe('SessionStartInfo', () => {
  it('toJSON()', () => {
    const properties = [];
    properties.push(new PropertyData('property name', 'property value'));

    const batchInfo = new BatchInfo('batch name');

    const ssi = new SessionStartInfo({
      agentId: 'some agent',
      sessionType: SessionType.SEQUENTIAL,
      appIdOrName: 'my app',
      verId: '1.0.0',
      scenarioIdOrName: 'some scenario',
      displayName: 'display name',
      batchInfo,
      baselineEnvName: 'some baseline name',
      environmentName: 'env name',
      environment: new AppEnvironment(),
      defaultMatchSettings: new ImageMatchSettings(),
      branchName: 'some branch name',
      parentBranchName: 'parent branch name',
      baselineBranchName: 'base branch',
      compareWithParentBranch: false,
      ignoreBaseline: false,
      render: false,
      saveDiffs: false,
      properties,
    });

    const actualSerialization = JSON.stringify(ssi);
    const expectedSerialization = '{"agentId":"some agent","sessionType":"SEQUENTIAL","appIdOrName":"my app",' +
      `"verId":"1.0.0","scenarioIdOrName":"some scenario","displayName":"display name","batchInfo":${JSON.stringify(batchInfo)},` +
      '"baselineEnvName":"some baseline name","environmentName":"env name","environment":{},' +
      '"defaultMatchSettings":{"matchLevel":"Strict","accessibilityLevel":"None","ignoreCaret":true,"useDom":false,"enablePatterns":false,"ignoreDisplacements":false,' +
      '"ignore":[],"layout":[],"strict":[],"content":[],"accessibility":[],"floating":[]},"branchName":"some branch name",' +
      '"parentBranchName":"parent branch name","baselineBranchName":"base branch","compareWithParentBranch":false,' +
      '"ignoreBaseline":false,"saveDiffs":false,"render":false,"properties":[{"name":"property name",' +
      '"value":"property value"}]}';
    assert.strictEqual(actualSerialization, expectedSerialization, 'SessionStartInfo serialization does not match!');
  });
});
