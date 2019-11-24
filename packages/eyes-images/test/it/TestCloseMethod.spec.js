'use strict';

const assertRejects = require('assert-rejects');
const { Eyes, BatchInfo, DiffsFoundError } = require('../../index');

describe('TestCloseMethod', function () {
  this.timeout(5 * 60 * 1000);

  it('TestClose', async function () {
    const batch = new BatchInfo();
    const eyes = new Eyes();
    eyes.setBatch(batch);

    await eyes.open(this.test.parent.title, this.test.title);
    await eyes.checkImage(`${__dirname}/../fixtures/gbg1.png`, 'TestBitmap1');
    await eyes.close(false);

    await eyes.open(this.test.parent.title, this.test.title);
    await eyes.checkImage(`${__dirname}/../fixtures/twitter1d-s4.png`, 'TestBitmap1');
    await assertRejects(eyes.close(true), DiffsFoundError);
  });
});
