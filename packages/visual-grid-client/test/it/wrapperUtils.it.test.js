'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const EyesWrapper = require('../../src/sdk/EyesWrapper');
const {configureWrappers} = require('../../src/sdk/wrapperUtils');
const assumeEnvironment = require('../../src/sdk/assumeEnvironment');

describe('wrapperUtils', () => {
  describe('configureWrappers', () => {
    it('sets useDom & enablePatterns', () => {
      let wrapper = new EyesWrapper();
      configureWrappers({
        wrappers: [wrapper],
        browsers: [{}],
        useDom: true,
        enablePatterns: true,
        assumeEnvironment,
      });
      expect(wrapper.getUseDom()).to.be.true;
      expect(wrapper.getEnablePatterns()).to.be.true;

      wrapper = new EyesWrapper();
      configureWrappers({
        wrappers: [wrapper],
        browsers: [{}],
        useDom: false,
        enablePatterns: false,
        assumeEnvironment,
      });
      expect(wrapper.getUseDom()).to.be.false;
      expect(wrapper.getEnablePatterns()).to.be.false;

      wrapper = new EyesWrapper();
      configureWrappers({wrappers: [wrapper], browsers: [{}], assumeEnvironment});
      expect(wrapper.getUseDom()).to.be.false;
      expect(wrapper.getEnablePatterns()).to.be.false;
    });
  });

  it('sets notifyOnCompletion', () => {
    let wrapper = new EyesWrapper();
    configureWrappers({
      wrappers: [wrapper],
      browsers: [{}],
      batchNotify: true,
      assumeEnvironment,
    });
    expect(wrapper._configuration.getBatch().getNotifyOnCompletion()).to.be.true;
  });
});
