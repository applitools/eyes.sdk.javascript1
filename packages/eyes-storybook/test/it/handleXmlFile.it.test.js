const fs = require('fs');
const {resolve} = require('path');
const {promisify} = require('util');
const {describe, it} = require('mocha');
const {expect} = require('chai');
const handleXmlFile = require('../../src/handleXmlFile');
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

describe('handleXmlFile', () => {
  const formatter = {toXmlOutput: () => 'the results'};

  it('works', async () => {
    let path;
    try {
      path = handleXmlFile(__dirname, formatter);
      expect(path).to.be.equal(resolve(__dirname, 'eyes.xml'));
      const content = await readFile(resolve(__dirname, 'eyes.xml'), 'utf8');
      expect(content).to.be.equal(formatter.toXmlOutput());
    } finally {
      path && (await unlink(path));
    }
  });
});
