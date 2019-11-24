'use strict';

const assert = require('assert');

const { TestResults, TestAccessibilityStatus, AccessibilityLevel, AccessibilityStatus, TestResultsStatus } = require('../../index');

describe('TestResults', () => {
  it('empty constructor', () => {
    const tr = new TestResults();
    assert.strictEqual(tr.toString(), 'TestResults of existing test {}');

    assert.strictEqual(undefined, tr.getContentMatches());
    assert.strictEqual(undefined, tr.getExactMatches());
    assert.strictEqual(undefined, tr.getLayoutMatches());
    assert.strictEqual(undefined, tr.getMatches());
    assert.strictEqual(undefined, tr.getMismatches());
    assert.strictEqual(undefined, tr.getMissing());
    assert.strictEqual(undefined, tr.getNoneMatches());
    assert.strictEqual(undefined, tr.getSteps());
    assert.strictEqual(undefined, tr.getStrictMatches());
    // assert.strictEqual(undefined, tr.New);
    assert.strictEqual(undefined, tr.getStatus());
    assert.strictEqual(undefined, tr.getApiUrls());
    assert.strictEqual(undefined, tr.getAppUrls());
    assert.strictEqual(undefined, tr.getAppName());
    assert.strictEqual(undefined, tr.getBatchId());
    assert.strictEqual(undefined, tr.getBatchName());
    assert.strictEqual(undefined, tr.getBranchName());
    assert.strictEqual(undefined, tr.getDuration());
    assert.strictEqual(undefined, tr.getHostApp());
    assert.strictEqual(undefined, tr.getHostOS());
    assert.strictEqual(undefined, tr.getHostDisplaySize());
    assert.strictEqual(undefined, tr.getId());
    assert.strictEqual(undefined, tr.getIsAborted());
    assert.strictEqual(undefined, tr.getIsDifferent());
    assert.strictEqual(undefined, tr.getIsNew());
    assert.strictEqual(false, tr.isPassed());
    assert.strictEqual(undefined, tr.getName());
    assert.strictEqual(undefined, tr.getSecretToken());
    assert.strictEqual(undefined, tr.getStartedAt());
    assert.strictEqual(undefined, tr.getStepsInfo());
    assert.strictEqual(undefined, tr.getAccessibilityStatus());


    tr.setContentMatches(1);
    tr.setExactMatches(2);
    tr.setLayoutMatches(3);
    tr.setMatches(4);
    tr.setMismatches(5);
    tr.setMissing(6);
    tr.setNoneMatches(7);
    tr.setSteps(8);
    tr.setStrictMatches(9);
    // tr.New = 10;
    tr.setStatus(TestResultsStatus.Failed);
    const tas = new TestAccessibilityStatus();
    tas.setLevel(AccessibilityLevel.AAA);
    tas.setStatus(AccessibilityStatus.Passed);
    tr.setAccessibilityStatus(tas);

    assert.strictEqual(1, tr.getContentMatches());
    assert.strictEqual(2, tr.getExactMatches());
    assert.strictEqual(3, tr.getLayoutMatches());
    assert.strictEqual(4, tr.getMatches());
    assert.strictEqual(5, tr.getMismatches());
    assert.strictEqual(6, tr.getMissing());
    assert.strictEqual(7, tr.getNoneMatches());
    assert.strictEqual(8, tr.getSteps());
    assert.strictEqual(9, tr.getStrictMatches());
    // assert.strictEqual(10, tr.New);
    assert.strictEqual(TestResultsStatus.Failed, tr.getStatus());

    assert.ok(tr.getAccessibilityStatus());
    assert.strictEqual(AccessibilityLevel.AAA, tr.getAccessibilityStatus().getLevel());
    assert.strictEqual(AccessibilityStatus.Passed, tr.getAccessibilityStatus().getStatus());
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
