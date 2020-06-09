'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const fetch = require('../../util/fetchWithNoCAVerify');
const makeStartServer = require('../../../src/plugin/server');
const express = require('express');

describe('plugin server', () => {
  it('starts at a random port', async () => {
    const app = express();
    app.get('/bla', (_req, res) => res.sendStatus(200));
    const startServer = makeStartServer({app, logger: console});
    const {eyesPort, closeServer} = await startServer();
    const resp = await fetch(`https://localhost:${eyesPort}/bla`);
    expect(resp.status).to.equal(200);
    await closeServer();
  });
});
