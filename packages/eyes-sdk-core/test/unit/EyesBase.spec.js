'use strict';

const assert = require('assert');

const { EyesBase } = require('../../index');

describe('EyesBase', () => {
  describe('setBatch()', () => {
    /** @type {EyesBase} */ let eyes;
    before(() => {
      eyes = new EyesBase();
    });

    it('should create an default batch', () => {
      const batch = eyes.getBatch();
      assert.strictEqual(typeof batch.getId(), 'string');
      assert.strictEqual(typeof batch.getName(), 'undefined');
      assert.strictEqual(typeof batch.getStartedAt(), 'object');
      assert.strictEqual(typeof batch.getSequenceName(), 'undefined');
    });

    it('should create batch with name', () => {
      eyes.setBatch('batch name');

      const batch = eyes.getBatch();
      assert.strictEqual(typeof batch.getId(), 'string');
      assert.strictEqual(batch.getName(), 'batch name');
      assert.strictEqual(typeof batch.getStartedAt(), 'object');
      assert.strictEqual(typeof batch.getSequenceName(), 'undefined');
    });

    it('should thrown an error because of wrong arguments order', () => {
      assert.throws(() => {
        eyes.setBatch(new Date(), 'my batch');
      });
    });

    it('should create batch with name, id', () => {
      eyes.setBatch('batch name', 'fake batch id');

      const batch = eyes.getBatch();
      assert.strictEqual(batch.getId(), 'fake batch id');
      assert.strictEqual(batch.getName(), 'batch name');
      assert.strictEqual(typeof batch.getStartedAt(), 'object');
      assert.strictEqual(typeof batch.getSequenceName(), 'undefined');
    });

    it('should create batch with name, id, time', () => {
      const time = new Date();
      time.setMilliseconds(0);

      eyes.setBatch('batch name2', 'fake batch id2', time);

      const batch = eyes.getBatch();
      assert.strictEqual(batch.getId(), 'fake batch id2');
      assert.strictEqual(batch.getName(), 'batch name2');
      assert.strictEqual(batch.getStartedAt().getTime(), time.getTime());
      assert.strictEqual(typeof batch.getSequenceName(), 'undefined');
    });

    it('should create batch with name, id, time, sequence', () => {
      const time = new Date();
      time.setMilliseconds(0);

      eyes.setBatch('batch name2', 'fake batch id2', time);

      const batch = eyes.getBatch();
      assert.strictEqual(batch.getId(), 'fake batch id2');
      assert.strictEqual(batch.getName(), 'batch name2');
      assert.strictEqual(batch.getStartedAt().getTime(), time.getTime());
      assert.strictEqual(batch.getSequenceName(), undefined);
    });

    it('should create batch from object', () => {
      const date = new Date(2019);
      eyes.setBatch({
        id: 'fake batch id',
        name: 'batch name',
        startedAt: date,
        sequenceName: 'beta sequence',
      });

      assert.strictEqual(eyes.getBatch().getId(), 'fake batch id');
      assert.strictEqual(eyes.getBatch().getName(), 'batch name');
      assert.strictEqual(eyes.getBatch().getStartedAt(), date);
      assert.strictEqual(eyes.getBatch().getSequenceName(), 'beta sequence');
    });

    it('should create batch from BatchInfo', () => {
      const defaultBatch = eyes.getBatch();

      eyes.setBatch('batch name', 'fake batch id');
      eyes.getBatch().setSequenceName('gamma sequence');

      const batch = eyes.getBatch();
      assert.strictEqual(batch.getId(), 'fake batch id');
      assert.strictEqual(batch.getName(), 'batch name');
      assert.strictEqual(batch.getSequenceName(), 'gamma sequence');
      assert.notDeepStrictEqual(batch, defaultBatch);
      assert.deepStrictEqual(eyes.getBatch(), batch);

      eyes.setBatch(defaultBatch);
      assert.deepStrictEqual(eyes.getBatch(), defaultBatch);
    });

    it('should create batch by default using values from env', () => {
      process.env.APPLITOOLS_BATCH_ID = 'fake id in env';
      process.env.APPLITOOLS_BATCH_NAME = 'fake batch name in env';
      process.env.APPLITOOLS_BATCH_SEQUENCE = 'delta sequence';

      const batch = eyes.getBatch();
      assert.strictEqual(batch.getId(), 'fake id in env');
      assert.strictEqual(batch.getName(), 'fake batch name in env');
      assert.strictEqual(batch.getSequenceName(), 'delta sequence');
    });

    afterEach(() => {
      eyes.setBatch(undefined);
    });
  });
});
