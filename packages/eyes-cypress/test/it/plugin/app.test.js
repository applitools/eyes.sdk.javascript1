'use strict';
const {describe, it, afterEach} = require('mocha');
const {expect} = require('chai');
const fetch = require('../../util/fetchWithNoCAVerify');
const {promisify: p} = require('util');
const {startApp} = require('../../../src/plugin/app');
const psetTimeout = p(setTimeout);
const https = require('https');
const fs = require('fs');
const path = require('path');

function listen(app) {
  const server = https.createServer(
    {
      key: fs.readFileSync(path.resolve(__dirname, '../../../src/pem/server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, '../../../src/pem/server.cert')),
    },
    app,
  );
  return new Promise(resolve => {
    server.listen(0, () => {
      resolve({
        port: server.address().port,
        close: server.close.bind(server),
      });
    });
  });
}

describe('app', () => {
  let close;
  const dataToSend = {someKey: 'blablabla'};

  afterEach(async () => {
    await close();
  });

  it('handles cors', async () => {
    const app = await startApp();
    const server = await listen(app);
    const {port} = server;
    close = server.close;
    const resp = await fetch(`https://localhost:${port}/hb`);
    expect(resp.status).to.equal(200);
    expect(resp.headers.get('access-control-allow-origin')).to.equal('*');
  });

  it('handles resource', async () => {
    let _id, _buffer;
    const app = await startApp({
      handlers: {
        putResource: (id, buffer) => {
          _id = id;
          _buffer = buffer;
        },
      },
    });

    const server = await listen(app);
    const {port} = server;
    close = server.close;
    const resp = await fetch(`https://localhost:${port}/eyes/resource/bla`, {
      method: 'PUT',
      body: JSON.stringify(dataToSend),
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    expect(resp.status).to.equal(200);

    const json = await resp.json();

    expect(json).to.eql({success: true});
    expect(_id).to.equal('bla');
    expect(_buffer).to.eql(Buffer.from(JSON.stringify(dataToSend)));
  });

  it('handles error in resource', async () => {
    const app = await startApp({
      handlers: {
        putResource: () => {
          throw new Error('putResource');
        },
      },
    });

    const server = await listen(app);
    const {port} = server;
    close = server.close;
    const resp = await fetch(`https://localhost:${port}/eyes/resource/bla`, {
      method: 'PUT',
      body: JSON.stringify(dataToSend),
    });

    expect(resp.status).to.equal(200);

    const json = await resp.json();

    expect(json).to.eql({success: false, error: 'putResource'});
  });

  it('handles encoded resource URI', async () => {
    let _id, _buffer;
    const app = await startApp({
      handlers: {
        putResource: (id, buffer) => {
          _id = id;
          _buffer = buffer;
        },
      },
    });

    const server = await listen(app);
    const {port} = server;
    close = server.close;
    const str = 'hello!@#$%|world';
    const resp = await fetch(`https://localhost:${port}/eyes/resource/${encodeURIComponent(str)}`, {
      method: 'PUT',
      body: JSON.stringify(dataToSend),
    });

    expect(resp.status).to.equal(200);

    const json = await resp.json();

    expect(json).to.eql({success: true});
    expect(_id).to.equal(str);
    expect(_buffer).to.eql(Buffer.from(JSON.stringify(dataToSend)));
  });

  it('handles eyes command', async () => {
    let _args;
    const app = await startApp({
      handlers: {
        bla: async args => {
          _args = args;
          return args;
        },
      },
    });

    const server = await listen(app);
    const {port} = server;
    close = server.close;

    const baseUrl = `https://localhost:${port}/eyes`;
    const resp = await fetch(`${baseUrl}/bla`, {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(resp.status).to.equal(200);

    const json = await resp.json();

    expect(_args).to.eql(dataToSend);
    expect(json).to.eql({success: true, result: dataToSend});
  });

  it('handles error in eyes command', async () => {
    const app = await startApp({
      handlers: {
        err: async () => {
          await psetTimeout(0);
          throw new Error('bla');
        },
      },
    });

    const server = await listen(app);
    const {port} = server;
    close = server.close;

    const baseUrl = `https://localhost:${port}/eyes`;
    const resp = await fetch(`${baseUrl}/err`, {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(resp.status).to.equal(200);

    const json = await resp.json();

    expect(json).to.eql({success: false, error: 'bla'});
  });
});
