'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const EyesWrapper = require('../../src/sdk/EyesWrapper');

describe('EyesWrapper', () => {
  it('viewport is kept if set before open', async () => {
    const wrapper = new EyesWrapper();
    await wrapper.setViewportSize({width: 1234, height: 4321});
    await wrapper.open({appName: 'myApp', testName: 'myTest'});
    expect(wrapper._viewportSizeHandler.get().toJSON()).to.deep.eq({width: 1234, height: 4321});
  });

  it('viewport is kept if set after open', async () => {
    const wrapper = new EyesWrapper();
    await wrapper.open({appName: 'myApp', testName: 'myTest'});
    await wrapper.setViewportSize({width: 1234, height: 4321});
    expect(wrapper._viewportSizeHandler.get().toJSON()).to.deep.eq({width: 1234, height: 4321});
  });
});
