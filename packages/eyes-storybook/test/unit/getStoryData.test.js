'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const {presult} = require('@applitools/functional-commons');
const makeGetStoryData = require('../../src/getStoryData');
const renderStoryWithClientAPI = require('../../dist/renderStoryWithClientAPI');
const logger = require('../util/testLogger');
const {deserializeDomSnapshotResult} = require('@applitools/eyes-sdk-core');

describe('getStoryData', () => {
  it('works', async () => {
    const page = {
      goto: async () => {},
      waitFor: async () => {},
      evaluate: func => Promise.resolve(func()),
    };
    const valueBuffer = Buffer.from('value');
    const blobs = [{url: 'url2', type: 'type', value: valueBuffer.toString('base64')}];
    const expectedResourceContents = {url2: {url: 'url2', type: 'type', value: valueBuffer}};
    const takeDomSnapshot = () =>
      deserializeDomSnapshotResult({
        resourceUrls: ['url1'],
        blobs,
        cdt: 'cdt',
        frames: [],
      });

    const getStoryData = makeGetStoryData({
      logger,
      takeDomSnapshot,
      waitBeforeScreenshot: 50,
    });
    const {resourceUrls, resourceContents, cdt} = await getStoryData({
      story: {},
      storyUrl: 'url',
      page,
    });

    expect(resourceUrls).to.eql(['url1']);
    expect(resourceContents).to.eql(expectedResourceContents);
    expect(cdt).to.equal('cdt');
  });

  it('waitsFor correctly with waitBeforeScreenshot before taking the screenshot', async () => {
    let waitedValue;
    const waitBeforeScreenshot = 'someValue';
    const page = {
      goto: async () => {},
      waitFor: async value => {
        waitedValue = value;
      },
      evaluate: func =>
        waitedValue === waitBeforeScreenshot
          ? Promise.resolve(func())
          : Promise.reject('did not wait enough before taking snapshot'),
    };

    const valueBuffer = Buffer.from('value');
    const blobs = [{url: 'url2', type: 'type', value: valueBuffer.toString('base64')}];
    const expectedResourceContents = {url2: {url: 'url2', type: 'type', value: valueBuffer}};
    const takeDomSnapshot = () =>
      deserializeDomSnapshotResult({
        resourceUrls: ['url1'],
        blobs,
        cdt: 'cdt',
        frames: [],
      });
    const getStoryData = makeGetStoryData({
      logger,
      takeDomSnapshot,
      waitBeforeScreenshot,
    });

    const {resourceUrls, resourceContents, cdt} = await getStoryData({
      story: {},
      storyUrl: 'url',
      page,
    });

    expect(resourceUrls).to.eql(['url1']);
    expect(resourceContents).to.eql(expectedResourceContents);
    expect(cdt).to.equal('cdt');
  });

  it('waitsFor correctly with waitBeforeScreenshot before taking a component screenshot', async () => {
    let waitedValue;
    const waitBeforeScreenshot = 'someValue';
    const page = {
      goto: async () => {},
      waitFor: async value => {
        waitedValue = value;
      },
      evaluate: func =>
        waitedValue === waitBeforeScreenshot
          ? Promise.resolve(func())
          : Promise.reject('did not wait enough before taking snapshot'),
    };

    const valueBuffer = Buffer.from('value');
    const blobs = [{url: 'url2', type: 'type', value: valueBuffer.toString('base64')}];
    const expectedResourceContents = {url2: {url: 'url2', type: 'type', value: valueBuffer}};
    const takeDomSnapshot = () =>
      deserializeDomSnapshotResult({
        resourceUrls: ['url1'],
        blobs,
        cdt: 'cdt',
        frames: [],
      });
    const getStoryData = makeGetStoryData({
      logger,
      takeDomSnapshot,
      waitBeforeScreenshot: 2000,
    });

    const {resourceUrls, resourceContents, cdt} = await getStoryData({
      story: {},
      storyUrl: 'url',
      page,
      waitBeforeStory: waitBeforeScreenshot,
    });

    expect(resourceUrls).to.eql(['url1']);
    expect(resourceContents).to.eql(expectedResourceContents);
    expect(cdt).to.equal('cdt');
  });

  it('throws when getting a negative waitBeforeScreenshot', async () => {
    const page = {
      goto: async () => {},
      waitFor: async () => {},
      evaluate: func => Promise.resolve(func()),
    };
    const valueBuffer = Buffer.from('value');
    const blobs = [{url: 'url2', type: 'type', value: valueBuffer.toString('base64')}];
    const takeDomSnapshot = () =>
      deserializeDomSnapshotResult({
        resourceUrls: ['url1'],
        blobs,
        cdt: 'cdt',
        frames: [],
      });

    const getStoryData = makeGetStoryData({
      logger,
      takeDomSnapshot,
      waitBeforeScreenshot: 50,
    });
    let err;
    try {
      await getStoryData({story: {}, storyUrl: 'url', page, waitBeforeStory: -5});
    } catch (e) {
      err = e;
    }
    expect(err.message).to.eql('IllegalArgument: waitBeforeScreenshot < 0');
  });

  it('throws when getting a negative waitBeforeScreenshot', async () => {
    const page = {
      goto: async () => {},
      waitFor: async () => {},
      evaluate: func => Promise.resolve(func()),
    };
    const valueBuffer = Buffer.from('value');
    const blobs = [{url: 'url2', type: 'type', value: valueBuffer.toString('base64')}];
    const takeDomSnapshot = () =>
      deserializeDomSnapshotResult({
        resourceUrls: ['url1'],
        blobs,
        cdt: 'cdt',
        frames: [],
      });

    const getStoryData = makeGetStoryData({
      logger,
      takeDomSnapshot,
      waitBeforeScreenshot: -50,
    });
    let err;
    try {
      await getStoryData({story: {}, storyUrl: 'url', page});
    } catch (e) {
      err = e;
    }
    expect(err.message).to.eql('IllegalArgument: waitBeforeScreenshot < 0');
  });

  it('throws when fails to render a story with api', async () => {
    const page = {
      evaluate: async func => {
        if (func === renderStoryWithClientAPI) {
          return {message: 'some render story error', version: 'some api version'};
        } else {
          return func();
        }
      },
    };
    const getStoryData = makeGetStoryData({
      logger,
      takeDomSnapshot: () => {},
    });
    const [err] = await presult(
      getStoryData({
        story: {isApi: true},
        storyUrl: 'url',
        page,
      }),
    );

    expect(err.message).to.eql(
      'Eyes could not render stories properly. The detected version of storybook is some api version. Contact support@applitools.com for troubleshooting.',
    );
  });

  it('reloads page when reloadPagePerStory is set', async () => {
    const page = {
      evaluate: async func => {
        if (func === renderStoryWithClientAPI) {
          return {
            message: 'getStoryData should not use client API when reloadPagePerStory is set',
            version: 'test version',
          };
        } else {
          return func();
        }
      },
      goto: async () => {},
      waitFor: async () => {},
    };
    const getStoryData = makeGetStoryData({
      logger,
      takeDomSnapshot: () =>
        deserializeDomSnapshotResult({
          resourceUrls: [],
          blobs: [],
          cdt: 'cdt',
          frames: [],
        }),
      reloadPagePerStory: true,
    });
    const data = await getStoryData({
      story: {isApi: true},
      storyUrl: 'url',
      page,
    });

    expect(data).to.eql({cdt: 'cdt', resourceUrls: [], resourceContents: {}, frames: []});
  });
});
