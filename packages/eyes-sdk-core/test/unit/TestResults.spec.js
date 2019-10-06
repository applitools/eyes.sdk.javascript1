'use strict';

const assert = require('assert');

const { TestResults } = require('../../index');

describe('TestResults', () => {
  it('empty constructor', () => {
    const testResults = new TestResults();
    assert.strictEqual(testResults.toString(), 'TestResults of existing test {}');
  });

  it('constructor with object', () => {
    const testResults = new TestResults({
      id: 'an id',
      name: 'a name',
      secretToken: 'a secret token',
      status: 'Passed',
      appName: 'an app name',
      baselineId: 'a baseline id',
      batchName: 'a batch name',
      batchId: 'a batch id',
      branchName: 'default',
      hostOS: 'Windows 10.0',
      hostApp: 'Chrome',
      accessibilityStatus: {
        status: 'Failed',
        level: 'AA',
      },
      hostDisplaySize: {
        width: 800,
        height: 560,
      },
      startedAt: '2018-06-18T15:53:49.4700558+00:00',
      duration: 7,
      isNew: false,
      isDifferent: false,
      isAborted: false,
      defaultMatchSettings: {
        matchLevel: 'Strict',
        accessibilityLevel: 'None',
        ignore: [],
        strict: [],
        content: [],
        accessibility: [],
        layout: [],
        floating: [],
        splitTopHeight: 0,
        splitBottomHeight: 0,
        ignoreCaret: false,
        scale: 1,
        remainder: 0,
      },
      appUrls: {
        batch: 'https://eyes.applitools.com/app/test-results/123?accountId=abc',
        session: 'https://eyes.applitools.com/app/test-results/123/567?accountId=abc',
      },
      apiUrls: {
        batch: 'https://eyesapi.applitools.com/api/sessions/batches/123',
        session: 'https://eyesapi.applitools.com/api/sessions/batches/123/567',
      },
      stepsInfo: [
        {
          name: 'Partial window',
          isDifferent: false,
          hasBaselineImage: true,
          hasCurrentImage: true,
          hasCheckpointImage: true,
          appUrls: {
            step: 'https://eyes.applitools.com/app/test-results/123/567/steps/1?accountId=abc',
            stepEditor: 'https://eyes.applitools.com/app/test-results/123/567/steps/1/edit?accountId=abc',
          },
          apiUrls: {
            baselineImage: 'https://eyesapi.applitools.com/api/images/se~c96494e0-4010-4107-a4bf-c21e97370700',
            currentImage: 'https://eyesapi.applitools.com/api/sessions/batches/123/567/steps/1/images/checkpoint',
            checkpointImage: 'https://eyesapi.applitools.com/api/sessions/batches/123/567/steps/1/images/checkpoint',
            checkpointImageThumbnail: 'https://eyesapi.applitools.com/api/sessions/batches/123/567/steps/1/images/...',
            diffImage: 'https://eyesapi.applitools.com/api/sessions/batches/123/567/steps/1/images/diff',
          },
        },
        {
          name: 'Entire window',
          isDifferent: false,
          hasBaselineImage: true,
          hasCurrentImage: true,
          hasCheckpointImage: true,
          appUrls: {
            step: 'https://eyes.applitools.com/app/test-results/123/567/steps/2?accountId=abc',
            stepEditor: 'https://eyes.applitools.com/app/test-results/123/567/steps/2/edit?accountId=abc',
          },
          apiUrls: {
            baselineImage: 'https://eyesapi.applitools.com/api/images/se~47d0195f-170e-4468-ae35-421903166e60',
            currentImage: 'https://eyesapi.applitools.com/api/sessions/batches/123/567/steps/2/images/checkpoint',
            checkpointImage: 'https://eyesapi.applitools.com/api/sessions/batches/123/567/steps/2/images/checkpoint',
            checkpointImageThumbnail: 'https://eyesapi.applitools.com/api/sessions/batches/123/567/steps/2/images/...',
            diffImage: 'https://eyesapi.applitools.com/api/sessions/batches/123/567/steps/2/images/diff',
          },
        },
      ],
      steps: 2,
      matches: 2,
      mismatches: 0,
      missing: 0,
      exactMatches: 0,
      strictMatches: 0,
      contentMatches: 0,
      layoutMatches: 0,
      noneMatches: 0,
      url: null,
    });
    assert.strictEqual(testResults.toString(), 'TestResults of existing test {"id":"an id","name":"a name",' +
      '"status":"Passed","appName":"an app name","batchName":"a batch name","batchId":"a batch id","branchName":' +
      '"default","hostOS":"Windows 10.0","hostApp":"Chrome","hostDisplaySize":{"width":800,"height":560},' +
      '"startedAt":"2018-06-18T15:53:49.470Z","duration":7,"isNew":false,"isDifferent":false,"isAborted":false,' +
      '"appUrls":{"batch":"https://eyes.applitools.com/app/test-results/123?accountId=abc","session":' +
      '"https://eyes.applitools.com/app/test-results/123/567?accountId=abc"},"apiUrls":{"batch":' +
      '"https://eyesapi.applitools.com/api/sessions/batches/123","session":' +
      '"https://eyesapi.applitools.com/api/sessions/batches/123/567"},"stepsInfo":[{"name":"Partial window",' +
      '"isDifferent":false,"hasBaselineImage":true,"hasCurrentImage":true,"appUrls":{"step":' +
      '"https://eyes.applitools.com/app/test-results/123/567/steps/1?accountId=abc","stepEditor":' +
      '"https://eyes.applitools.com/app/test-results/123/567/steps/1/edit?accountId=abc"}},{"name":"Entire window",' +
      '"isDifferent":false,"hasBaselineImage":true,"hasCurrentImage":true,"appUrls":{"step":' +
      '"https://eyes.applitools.com/app/test-results/123/567/steps/2?accountId=abc","stepEditor":' +
      '"https://eyes.applitools.com/app/test-results/123/567/steps/2/edit?accountId=abc"}}],"steps":2,"matches":2,' +
      '"mismatches":0,"missing":0,"exactMatches":0,"strictMatches":0,"contentMatches":0,"layoutMatches":0,' +
      '"noneMatches":0,"url":null,"accessibilityStatus":{"status":"Failed","level":"AA"}}');
  });
});
