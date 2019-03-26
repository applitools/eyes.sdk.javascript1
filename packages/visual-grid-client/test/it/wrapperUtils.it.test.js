'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const EyesWrapper = require('../../src/sdk/EyesWrapper');
const {configureWrappers} = require('../../src/sdk/wrapperUtils');

describe('wrapperUtils', () => {
  describe('configureWrappers', () => {
    it('sets useDom & enablePatterns', () => {
      let wrapper = new EyesWrapper();
      configureWrappers({wrappers: [wrapper], browsers: [{}], useDom: true, enablePatterns: true});
      expect(wrapper.getUseDom()).to.be.true;
      expect(wrapper.getEnablePatterns()).to.be.true;

      wrapper = new EyesWrapper();
      configureWrappers({
        wrappers: [wrapper],
        browsers: [{}],
        useDom: false,
        enablePatterns: false,
      });
      expect(wrapper.getUseDom()).to.be.false;
      expect(wrapper.getEnablePatterns()).to.be.false;

      wrapper = new EyesWrapper();
      configureWrappers({wrappers: [wrapper], browsers: [{}]});
      expect(wrapper.getUseDom()).to.be.false;
      expect(wrapper.getEnablePatterns()).to.be.false;
    });
  });
});
