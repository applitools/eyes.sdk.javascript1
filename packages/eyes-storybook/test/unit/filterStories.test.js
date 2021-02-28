'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const filterStories = require('../../src/filterStories');

describe('filterStories', () => {
  it('filters by function in global config', () => {
    const stories = [{name: 'aaa', bla: 'kuku'}, {name: 'bbb'}];
    const config = {include: ({name}) => name === 'aaa'};
    expect(filterStories({stories, config})).to.eql([{name: 'aaa', bla: 'kuku'}]);
  });

  it('filters by truthy value in global config', () => {
    const stories = [{name: 'aaa', bla: 'kuku'}, {name: 'bbb'}];
    const config = {include: true};
    expect(filterStories({stories, config})).to.eql(stories);
  });

  it('filters by falsy value in global config', () => {
    const stories = [{name: 'aaa', bla: 'kuku'}, {name: 'bbb'}];
    const config = {include: false};
    expect(filterStories({stories, config})).to.eql([]);
  });

  it('filters by local parameter', () => {
    const stories = [
      {name: 'aaa', bla: 'kuku'},
      {name: 'bbb', parameters: {eyes: {include: false}}},
    ];
    expect(filterStories({stories, config: {}})).to.eql([{name: 'aaa', bla: 'kuku'}]);
  });

  it('filters with precedence of local (true) over global (false)', () => {
    const stories = [
      {name: 'aaa', bla: 'kuku'},
      {name: 'bbb', parameters: {eyes: {include: true}}},
    ];
    const config = {include: ({name}) => name === 'aaa'};
    expect(filterStories({stories, config})).to.eql(stories);
  });

  it('filters with precedence of local (false) over global (true)', () => {
    const stories = [
      {name: 'aaa', bla: 'kuku'},
      {name: 'bbb', parameters: {eyes: {include: false}}},
    ];
    const config = {include: ({name}) => name === 'bbb'};
    expect(filterStories({stories, config})).to.eql([]);
  });

  it("doesn't fail when parameters are missing the 'eyes' property", () => {
    const stories = [{name: 'bbb', bla: 'kuku', parameters: {}}];
    const config = {include: ({name}) => name === 'aaa'};
    expect(filterStories({stories, config})).to.eql([]);
  });

  it('filter by story title when using a function', () => {
    const stories = [
      {name: 'aaa', kind: 'bbb', bla: 'kuku', parameters: {eyes: {variationUrlParam: 'var1'}}},
    ];
    const config = {
      include: story => {
        return story.storyTitle === 'bbb: aaa [var1]';
      },
    };
    expect(filterStories({stories, config})).to.eql(stories);
  });

  it('filter by story title when using a string', () => {
    const stories = [{name: 'aaa', kind: 'bbb', bla: 'kuku', parameters: {}}];
    const config = {include: 'bbb: aaa'};
    expect(filterStories({stories, config})).to.eql(stories);
  });

  it('filter by story title when using a regex string', () => {
    const stories = [
      {name: 'aaa', kind: 'bbb', bla: 'kuku', parameters: {}},
      {name: 'aaa', kind: 'ccc', bla: 'kuku', parameters: {}},
    ];
    const config = {include: /bbb: */};
    expect(filterStories({stories, config})).to.eql(stories.slice(0, 1));
  });
});
