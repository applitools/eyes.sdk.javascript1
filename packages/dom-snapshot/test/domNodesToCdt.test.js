'use strict';
const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const {JSDOM} = require('jsdom');
const path = require('path');
const domNodesToCdt = require('../src/browser/domNodesToCdt');
const {loadFixture, loadJsonFixture} = require('./util/loadFixture');
const fs = require('fs');
const {resolve} = require('path');
const {testServer} = require('@applitools/sdk-shared');

function getDocNode(htmlStr) {
  const dom = new JSDOM(htmlStr, {url: 'http://something.org/', resources: 'usable'});
  return dom.window.document;
}

const Node = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
  DOCUMENT_NODE: 9,
  DOCUMENT_TYPE_NODE: 10,
  DOCUMENT_FRAGMENT_NODE: 11,
};

const CSSRule = {
  STYLE_RULE: 1,
  CHARSET_RULE: 2,
  IMPORT_RULE: 3,
  MEDIA_RULE: 4,
  FONT_FACE_RULE: 5,
  PAGE_RULE: 6,
  NAMESPACE_RULE: 10,
  KEYFRAMES_RULE: 7,
  KEYFRAME_RULE: 8,
  SUPPORTS_RULE: 12,
};

describe('domNodesToCdt', () => {
  before(() => {
    global.Node = Node;
    global.CSSRule = CSSRule;
  });

  after(() => {
    delete global.Node;
    delete global.CSSRule;
  });

  it('works for DOM with 1 element', () => {
    const docNode = getDocNode('<div style="color:red;">hello</div>');
    const {cdt} = domNodesToCdt(docNode);
    const expected = [
      {
        nodeType: Node.DOCUMENT_NODE,
        childNodeIndexes: [5],
      },
      {
        nodeType: Node.ELEMENT_NODE,
        nodeName: 'HEAD',
        attributes: [],
        childNodeIndexes: [],
      },
      {
        nodeType: Node.TEXT_NODE,
        nodeValue: 'hello',
      },
      {
        nodeType: Node.ELEMENT_NODE,
        nodeName: 'DIV',
        childNodeIndexes: [2],
        attributes: [{name: 'style', value: 'color:red;'}],
      },
      {
        nodeType: Node.ELEMENT_NODE,
        nodeName: 'BODY',
        childNodeIndexes: [3],
        attributes: [],
      },
      {
        nodeType: Node.ELEMENT_NODE,
        nodeName: 'HTML',
        attributes: [],
        childNodeIndexes: [1, 4],
      },
    ];
    expect(cdt).to.deep.equal(expected);
  });

  it('works for stylesheet that loads css rules dynamically', () => {
    const docNode = getDocNode('<style id="stl">div{ color:red; }</style>');
    docNode.getElementById('stl').sheet.insertRule('div{ color:green !important; }');
    const {cdt} = domNodesToCdt(docNode);
    expect(cdt).to.eql([
      {nodeType: 9, childNodeIndexes: [5]},
      {nodeType: 3, nodeValue: 'div{color:green!important}div{color:red}'},
      {
        nodeType: 1,
        nodeName: 'STYLE',
        attributes: [{name: 'id', value: 'stl'}],
        childNodeIndexes: [1],
      },
      {nodeType: 1, nodeName: 'HEAD', attributes: [], childNodeIndexes: [2]},
      {nodeType: 1, nodeName: 'BODY', attributes: [], childNodeIndexes: []},
      {nodeType: 1, nodeName: 'HTML', attributes: [], childNodeIndexes: [3, 4]},
    ]);
  });

  it('works namespace attributes', () => {
    const docNode = getDocNode('<use xmlns:href="hello"/>');
    const {cdt} = domNodesToCdt(docNode);
    expect(cdt).to.eql([
      {nodeType: 9, childNodeIndexes: [4]},
      {nodeType: 1, nodeName: 'HEAD', attributes: [], childNodeIndexes: []},
      {
        nodeType: 1,
        nodeName: 'USE',
        attributes: [{name: 'xmlns:href', value: 'hello'}],
        childNodeIndexes: [],
      },
      {nodeType: 1, nodeName: 'BODY', attributes: [], childNodeIndexes: [2]},
      {nodeType: 1, nodeName: 'HTML', attributes: [], childNodeIndexes: [1, 3]},
    ]);
  });

  it('works for test-visual-grid.html', () => {
    const docNode = getDocNode(loadFixture('test-visual-grid.html'));
    const {cdt} = domNodesToCdt(docNode);
    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      const cdtStr = JSON.stringify(cdt, null, 2);
      fs.writeFileSync(resolve(__dirname, 'fixtures/test-visual-grid.jsdom.cdt.json'), cdtStr);
    }
    const expectedCdt = loadJsonFixture('test-visual-grid.jsdom.cdt.json');
    expect(cdt).to.deep.equal(expectedCdt);
  });

  it('trims blob: urls', () => {
    const docNode = getDocNode('<link href="blob:http://something/bla"/>');
    const {cdt} = domNodesToCdt(docNode);
    const expectedCdt = [
      {
        nodeType: Node.DOCUMENT_NODE,
        childNodeIndexes: [4],
      },
      {
        nodeType: Node.ELEMENT_NODE,
        nodeName: 'LINK',
        childNodeIndexes: [],
        attributes: [{name: 'href', value: 'http://something/bla'}],
      },
      {
        nodeType: Node.ELEMENT_NODE,
        nodeName: 'HEAD',
        attributes: [],
        childNodeIndexes: [1],
      },
      {
        nodeType: Node.ELEMENT_NODE,
        nodeName: 'BODY',
        childNodeIndexes: [],
        attributes: [],
      },
      {
        nodeType: Node.ELEMENT_NODE,
        nodeName: 'HTML',
        attributes: [],
        childNodeIndexes: [2, 3],
      },
    ];
    expect(cdt).to.eql(expectedCdt);
  });

  it('returns inputs with checked attribute if the element had checked property', () => {
    const docNode = getDocNode(`
    <input id="cb" type="checkbox">
    <input id="cb1" type="checkbox" checked="checked">
    <input id="rd" type="radio">
    <input id="rd2" type="radio" checked="checked">
    `);
    docNode.getElementById('cb').checked = true;
    docNode.getElementById('cb1').checked = false;
    docNode.getElementById('rd').checked = true;
    docNode.getElementById('rd2').checked = false;
    const {cdt} = domNodesToCdt(docNode);

    const expectedCdt = [
      {nodeType: 9, childNodeIndexes: [11]},
      {nodeType: 1, nodeName: 'HEAD', attributes: [], childNodeIndexes: []},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: 'cb'},
          {name: 'type', value: 'checkbox'},
          {name: 'checked'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n    '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: 'cb1'},
          {name: 'type', value: 'checkbox'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n    '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [{name: 'id', value: 'rd'}, {name: 'type', value: 'radio'}, {name: 'checked'}],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n    '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: 'rd2'},
          {name: 'type', value: 'radio'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n    '},
      {nodeType: 1, nodeName: 'BODY', attributes: [], childNodeIndexes: [2, 3, 4, 5, 6, 7, 8, 9]},
      {nodeType: 1, nodeName: 'HTML', attributes: [], childNodeIndexes: [1, 10]},
    ];
    expect(cdt).to.eql(expectedCdt);
  });

  it('returns inputs with checked attribute if the element had checked attribute', () => {
    const docNode = getDocNode(
      `<input id="cb" checked=1 type="checkbox">
      <input id="rd" checked=1 type="radio">
      <input id="rd1" checked=1 type="radio">
      <input id="rd2" checked=0 type="radio">
      `,
    );
    docNode.getElementById('cb').checked = true;
    docNode.getElementById('rd').checked = true;
    const {cdt} = domNodesToCdt(docNode);

    const expectedCdt = [
      {nodeType: 9, childNodeIndexes: [11]},
      {nodeType: 1, nodeName: 'HEAD', attributes: [], childNodeIndexes: []},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: 'cb'},
          {name: 'checked', value: '1'},
          {name: 'type', value: 'checkbox'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: 'rd'},
          {name: 'checked', value: '1'},
          {name: 'type', value: 'radio'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: 'rd1'},
          {name: 'checked', value: '1'},
          {name: 'type', value: 'radio'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: 'rd2'},
          {name: 'checked', value: '0'},
          {name: 'type', value: 'radio'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {nodeType: 1, nodeName: 'BODY', attributes: [], childNodeIndexes: [2, 3, 4, 5, 6, 7, 8, 9]},
      {nodeType: 1, nodeName: 'HTML', attributes: [], childNodeIndexes: [1, 10]},
    ];
    expect(cdt).to.deep.equal(expectedCdt);
  });

  it('returns inputs with value attribute while having default values', () => {
    const types = `
      <input id="1" type="date" value="2020-12-15">
      <input id="2" type="datetime-local" value="2020-04-20T15:45">
      <input id="3" type="email" value="danielsch24@gmail.com">
      <input id="4" type="month" value="2020-01">
      <input id="5" type="number" value="2">
      <input id="6" type="password" value="123456">
      <input id="7" type="search" value="some">
      <input id="8" type="tel" value="0543973434">
      <input id="9" type="text" value="some some">
      <input id="10" type="time" value="16:20">
      <input id="11" type="url" value="www.google.com">
      <input id="12" type="week" value="2019-W01">
    `;

    const docNode = getDocNode(types);
    docNode.getElementById(1).value = '2020-12-16';
    docNode.getElementById(2).value = '2020-04-20T15:46';
    docNode.getElementById(3).value = 'danielsch25@gmail.com';
    docNode.getElementById(4).value = '2020-02';
    docNode.getElementById(5).value = '3';
    docNode.getElementById(6).value = '6666';
    docNode.getElementById(7).value = 'another';
    docNode.getElementById(8).value = '0543454545';
    docNode.getElementById(9).value = 'another yo';
    docNode.getElementById(10).value = '16:21';
    docNode.getElementById(11).value = 'www.daniel.com';
    docNode.getElementById(12).value = '2019-W02';

    const {cdt} = domNodesToCdt(docNode);
    const expectedCdt = [
      {nodeType: 9, childNodeIndexes: [27]},
      {nodeType: 1, nodeName: 'HEAD', attributes: [], childNodeIndexes: []},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '1'},
          {name: 'type', value: 'date'},
          {name: 'value', value: '2020-12-16'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '2'},
          {name: 'type', value: 'datetime-local'},
          {name: 'value', value: '2020-04-20T15:46'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '3'},
          {name: 'type', value: 'email'},
          {name: 'value', value: 'danielsch25@gmail.com'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '4'},
          {name: 'type', value: 'month'},
          {name: 'value', value: '2020-02'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '5'},
          {name: 'type', value: 'number'},
          {name: 'value', value: '3'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '6'},
          {name: 'type', value: 'password'},
          {name: 'value', value: '6666'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '7'},
          {name: 'type', value: 'search'},
          {name: 'value', value: 'another'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '8'},
          {name: 'type', value: 'tel'},
          {name: 'value', value: '0543454545'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '9'},
          {name: 'type', value: 'text'},
          {name: 'value', value: 'another yo'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '10'},
          {name: 'type', value: 'time'},
          {name: 'value', value: '16:21'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '11'},
          {name: 'type', value: 'url'},
          {name: 'value', value: 'www.daniel.com'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '12'},
          {name: 'type', value: 'week'},
          {name: 'value', value: '2019-W02'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n    '},
      {
        nodeType: 1,
        nodeName: 'BODY',
        attributes: [],
        childNodeIndexes: [
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
        ],
      },
      {nodeType: 1, nodeName: 'HTML', attributes: [], childNodeIndexes: [1, 26]},
    ];
    expect(cdt).to.eql(expectedCdt);
  });

  it('returns inputs with value attribute while not having default values', () => {
    const types = `
      <input id="1" type="date">
      <input id="2" type="datetime-local">
      <input id="3" type="email">
      <input id="4" type="month">
      <input id="5" type="number">
      <input id="6" type="password">
      <input id="7" type="search">
      <input id="8" type="tel">
      <input id="9" type="text">
      <input id="10" type="time">
      <input id="11" type="url">
      <input id="12" type="week">
    `;

    const docNode = getDocNode(types);
    docNode.getElementById(1).value = '2020-12-16';
    docNode.getElementById(2).value = '2020-04-20T15:46';
    docNode.getElementById(3).value = 'danielsch25@gmail.com';
    docNode.getElementById(4).value = '2020-02';
    docNode.getElementById(5).value = '3';
    docNode.getElementById(6).value = '6666';
    docNode.getElementById(7).value = 'another';
    docNode.getElementById(8).value = '0543454545';
    docNode.getElementById(9).value = 'another yo';
    docNode.getElementById(10).value = '16:21';
    docNode.getElementById(11).value = 'www.daniel.com';
    docNode.getElementById(12).value = '2019-W02';

    const {cdt} = domNodesToCdt(docNode);
    const expectedCdt = [
      {nodeType: 9, childNodeIndexes: [27]},
      {nodeType: 1, nodeName: 'HEAD', attributes: [], childNodeIndexes: []},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '1'},
          {name: 'type', value: 'date'},
          {name: 'value', value: '2020-12-16'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '2'},
          {name: 'type', value: 'datetime-local'},
          {name: 'value', value: '2020-04-20T15:46'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '3'},
          {name: 'type', value: 'email'},
          {name: 'value', value: 'danielsch25@gmail.com'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '4'},
          {name: 'type', value: 'month'},
          {name: 'value', value: '2020-02'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '5'},
          {name: 'type', value: 'number'},
          {name: 'value', value: '3'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '6'},
          {name: 'type', value: 'password'},
          {name: 'value', value: '6666'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '7'},
          {name: 'type', value: 'search'},
          {name: 'value', value: 'another'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '8'},
          {name: 'type', value: 'tel'},
          {name: 'value', value: '0543454545'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '9'},
          {name: 'type', value: 'text'},
          {name: 'value', value: 'another yo'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '10'},
          {name: 'type', value: 'time'},
          {name: 'value', value: '16:21'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '11'},
          {name: 'type', value: 'url'},
          {name: 'value', value: 'www.daniel.com'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '12'},
          {name: 'type', value: 'week'},
          {name: 'value', value: '2019-W02'},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n    '},
      {
        nodeType: 1,
        nodeName: 'BODY',
        attributes: [],
        childNodeIndexes: [
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
        ],
      },
      {nodeType: 1, nodeName: 'HTML', attributes: [], childNodeIndexes: [1, 26]},
    ];
    expect(cdt).to.eql(expectedCdt);
  });

  it('returns inputs with empty value attribute', () => {
    const types = `
      <input id="1" type="date" value="2020-12-15">
      <input id="2" type="datetime-local" value="2020-04-20T15:45">
      <input id="3" type="email" value="danielsch24@gmail.com">
      <input id="4" type="month" value="2020-01">
      <input id="5" type="number" value="2">
      <input id="6" type="password" value="123456">
      <input id="7" type="search" value="some">
      <input id="8" type="tel">
      <input id="9" type="text">
      <input id="10" type="time">
      <input id="11" type="url">
      <input id="12" type="week">
    `;

    const docNode = getDocNode(types);
    docNode.getElementById(1).value = '';
    docNode.getElementById(2).value = '';
    docNode.getElementById(3).value = '';
    docNode.getElementById(4).value = '';
    docNode.getElementById(5).value = '';
    docNode.getElementById(6).value = null;
    docNode.getElementById(7).value = null;
    docNode.getElementById(8).value = null;
    docNode.getElementById(9).value = null;
    docNode.getElementById(10).value = null;
    docNode.getElementById(11).value = '';
    docNode.getElementById(12).value = '';

    const {cdt} = domNodesToCdt(docNode);

    const expectedCdt = [
      {nodeType: 9, childNodeIndexes: [27]},
      {nodeType: 1, nodeName: 'HEAD', attributes: [], childNodeIndexes: []},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '1'},
          {name: 'type', value: 'date'},
          {name: 'value', value: ''},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '2'},
          {name: 'type', value: 'datetime-local'},
          {name: 'value', value: ''},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '3'},
          {name: 'type', value: 'email'},
          {name: 'value', value: ''},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '4'},
          {name: 'type', value: 'month'},
          {name: 'value', value: ''},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '5'},
          {name: 'type', value: 'number'},
          {name: 'value', value: ''},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '6'},
          {name: 'type', value: 'password'},
          {name: 'value', value: ''},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '7'},
          {name: 'type', value: 'search'},
          {name: 'value', value: ''},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '8'},
          {name: 'type', value: 'tel'},
          {name: 'value', value: ''},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '9'},
          {name: 'type', value: 'text'},
          {name: 'value', value: ''},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '10'},
          {name: 'type', value: 'time'},
          {name: 'value', value: ''},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '11'},
          {name: 'type', value: 'url'},
          {name: 'value', value: ''},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {name: 'id', value: '12'},
          {name: 'type', value: 'week'},
          {name: 'value', value: ''},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n    '},
      {
        nodeType: 1,
        nodeName: 'BODY',
        attributes: [],
        childNodeIndexes: [
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
        ],
      },
      {nodeType: 1, nodeName: 'HTML', attributes: [], childNodeIndexes: [1, 26]},
    ];
    expect(cdt).to.eql(expectedCdt);
  });

  it('do not map unnecessary inputs value to attributes', () => {
    const types = `
      <input id="1" type="range" value="1">
      <input id="2" type="range" value="1">
    `;

    const docNode = getDocNode(types);
    docNode.getElementById(1).value = '0';
    docNode.getElementById(2).value = '';

    const {cdt} = domNodesToCdt(docNode);

    const expectedCdt = [
      {
        nodeType: 9,
        childNodeIndexes: [7],
      },
      {
        nodeType: 1,
        nodeName: 'HEAD',
        attributes: [],
        childNodeIndexes: [],
      },
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {
            name: 'id',
            value: '1',
          },
          {
            name: 'type',
            value: 'range',
          },
          {
            name: 'value',
            value: '1',
          },
        ],
        childNodeIndexes: [],
      },
      {
        nodeType: 3,
        nodeValue: '\n      ',
      },
      {
        nodeType: 1,
        nodeName: 'INPUT',
        attributes: [
          {
            name: 'id',
            value: '2',
          },
          {
            name: 'type',
            value: 'range',
          },
          {
            name: 'value',
            value: '1',
          },
        ],
        childNodeIndexes: [],
      },
      {
        nodeType: 3,
        nodeValue: '\n    ',
      },
      {
        nodeType: 1,
        nodeName: 'BODY',
        attributes: [],
        childNodeIndexes: [2, 3, 4, 5],
      },
      {
        nodeType: 1,
        nodeName: 'HTML',
        attributes: [],
        childNodeIndexes: [1, 6],
      },
    ];
    expect(cdt).to.eql(expectedCdt);
  });

  it('returns inputs with value attribute while not having default values', () => {
    const types = `
      <select id="sel">
        <option value="1">one</option>
        <option value="2">two</option>
        <option value="3">three</option>
      <select>
    `;

    const docNode = getDocNode(types);
    docNode.getElementById('sel').value = '2';

    const {cdt} = domNodesToCdt(docNode);
    const expectedCdt = [
      {nodeType: 9, childNodeIndexes: [15]},
      {nodeType: 1, nodeName: 'HEAD', attributes: [], childNodeIndexes: []},
      {nodeType: 3, nodeValue: '\n        '},
      {nodeType: 3, nodeValue: 'one'},
      {
        nodeType: 1,
        nodeName: 'OPTION',
        attributes: [{name: 'value', value: '1'}],
        childNodeIndexes: [3],
      },
      {nodeType: 3, nodeValue: '\n        '},
      {nodeType: 3, nodeValue: 'two'},
      {
        nodeType: 1,
        nodeName: 'OPTION',
        attributes: [
          {name: 'value', value: '2'},
          {name: 'selected', value: ''},
        ],
        childNodeIndexes: [6],
      },
      {nodeType: 3, nodeValue: '\n        '},
      {nodeType: 3, nodeValue: 'three'},
      {
        nodeType: 1,
        nodeName: 'OPTION',
        attributes: [{name: 'value', value: '3'}],
        childNodeIndexes: [9],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'SELECT',
        attributes: [{name: 'id', value: 'sel'}],
        childNodeIndexes: [2, 4, 5, 7, 8, 10, 11],
      },
      {nodeType: 3, nodeValue: '\n    '},
      {nodeType: 1, nodeName: 'BODY', attributes: [], childNodeIndexes: [12, 13]},
      {nodeType: 1, nodeName: 'HTML', attributes: [], childNodeIndexes: [1, 14]},
    ];
    expect(cdt).to.eql(expectedCdt);
  });

  it('builds a text node for a textArea', () => {
    const types = `
      <textarea id="txt">
      <textarea/>
    `;

    const docNode = getDocNode(types);
    docNode.getElementById('txt').value = 'someValue';

    const {cdt} = domNodesToCdt(docNode);
    const expectedCdt = [
      {
        childNodeIndexes: [5],
        nodeType: 9,
      },
      {
        attributes: [],
        childNodeIndexes: [],
        nodeName: 'HEAD',
        nodeType: 1,
      },
      {
        nodeType: 3,
        nodeValue: 'someValue',
      },
      {
        attributes: [
          {
            name: 'id',
            value: 'txt',
          },
        ],
        childNodeIndexes: [2],
        nodeName: 'TEXTAREA',
        nodeType: 1,
      },
      {
        attributes: [],
        childNodeIndexes: [3],
        nodeName: 'BODY',
        nodeType: 1,
      },
      {
        attributes: [],
        childNodeIndexes: [1, 4],
        nodeName: 'HTML',
        nodeType: 1,
      },
    ];
    expect(cdt).to.eql(expectedCdt);
  });

  it('returns shadow dom correctly in CDT and docuemnts', () => {
    const document = getDocNode('<div class="host"><span>normal dom</span></div>');

    const host = document.querySelector('.host');
    const shadow = host.attachShadow({mode: 'open'});
    const img = document.createElement('img');
    img.src = 'smurfs.jpg';
    shadow.appendChild(img);
    const div = document.createElement('div');
    div.innerHTML = 'inner div';
    shadow.appendChild(div);

    const {cdt, docRoots} = domNodesToCdt(document);

    const expectedCdt = [
      {nodeType: 9, childNodeIndexes: [10]},
      {nodeType: 1, nodeName: 'HEAD', attributes: [], childNodeIndexes: []},
      {nodeType: 3, nodeValue: 'normal dom'},
      {nodeType: 1, nodeName: 'SPAN', attributes: [], childNodeIndexes: [2]},
      {
        nodeType: 1,
        nodeName: 'IMG',
        attributes: [{name: 'src', value: 'smurfs.jpg'}],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: 'inner div'},
      {nodeType: 1, nodeName: 'DIV', attributes: [], childNodeIndexes: [5]},
      {nodeType: 11, nodeName: '#document-fragment', attributes: [], childNodeIndexes: [4, 6]},
      {
        nodeType: 1,
        nodeName: 'DIV',
        attributes: [{name: 'class', value: 'host'}],
        childNodeIndexes: [3],
        shadowRootIndex: 7,
      },
      {nodeType: 1, nodeName: 'BODY', attributes: [], childNodeIndexes: [8]},
      {nodeType: 1, nodeName: 'HTML', attributes: [], childNodeIndexes: [1, 9]},
    ];
    expect(cdt).to.eql(expectedCdt);
    expect(docRoots).to.eql([document, shadow]);
  });

  it('returns script tag without src attribute', () => {
    const docNode = getDocNode(
      '<script id="it" src="dont-return-me.js">const DONT_RETURN_ME=true</script>',
    );
    const {cdt} = domNodesToCdt(docNode);
    const expectedCdt = [
      {nodeType: 9, childNodeIndexes: [4]},
      {
        nodeType: 1,
        nodeName: 'SCRIPT',
        attributes: [{name: 'id', value: 'it'}],
        childNodeIndexes: [],
      },
      {nodeType: 1, nodeName: 'HEAD', attributes: [], childNodeIndexes: [1]},
      {nodeType: 1, nodeName: 'BODY', attributes: [], childNodeIndexes: []},
      {nodeType: 1, nodeName: 'HTML', attributes: [], childNodeIndexes: [2, 3]},
    ];
    expect(cdt).to.deep.equal(expectedCdt);
  });

  it('returns only attributes that have a local name', () => {
    const document = getDocNode('<div attr1="one" attr2="">text</div>');
    const div = document.querySelector('div');
    div.attributes['attr4'] = () => {}; // some proxy dick - dont return this
    div.attributes['attr5'] = 55; // dont return this
    const {cdt} = domNodesToCdt(document);
    const expectedCdtDiv = {
      nodeType: 1,
      nodeName: 'DIV',
      attributes: [
        {name: 'attr1', value: 'one'},
        {name: 'attr2', value: ''},
      ],
      childNodeIndexes: [2],
    };
    expect(cdt[3]).to.deep.equal(expectedCdtDiv);
  });

  it('sanitizes on<event-name> attributes for basic node', () => {
    const document = getDocNode('<div onclick="some()" attrkey="attrval">text</div>');
    const {cdt} = domNodesToCdt(document);
    const expectedCdtDiv = {
      nodeType: 1,
      nodeName: 'DIV',
      attributes: [
        {name: 'onclick', value: ''},
        {name: 'attrkey', value: 'attrval'},
      ],
      childNodeIndexes: [2],
    };
    expect(cdt[3]).to.deep.equal(expectedCdtDiv);
  });

  it('sanitizes on<event-name> attributes for script node', () => {
    const docNode = getDocNode('<script onload="foo()" src="dont-return-me.js"></script>');
    const {cdt} = domNodesToCdt(docNode);
    const expectedCdt = [
      {nodeType: 9, childNodeIndexes: [4]},
      {
        nodeType: 1,
        nodeName: 'SCRIPT',
        attributes: [{name: 'onload', value: ''}],
        childNodeIndexes: [],
      },
      {nodeType: 1, nodeName: 'HEAD', attributes: [], childNodeIndexes: [1]},
      {nodeType: 1, nodeName: 'BODY', attributes: [], childNodeIndexes: []},
      {nodeType: 1, nodeName: 'HTML', attributes: [], childNodeIndexes: [2, 3]},
    ];
    expect(cdt).to.deep.equal(expectedCdt);
  });

  it('returns links with having disabled attribute', async () => {
    const server = await testServer({port: 7373});

    const cssPath = 'http://localhost:7373/test.css';
    const docNode = getDocNode(`
      <link id="lnk1" rel="stylesheet" type="text/css" href="${cssPath}">
      <link id="lnk2" rel="stylesheet" type="text/css" href="${cssPath}" disabled>
      <link id="lnk3" rel="stylesheet" type="text/css" href="${cssPath}" disabled>
    `);

    const expectedCdt = [
      {nodeType: 9, childNodeIndexes: [9]},
      {
        nodeType: 1,
        nodeName: 'LINK',
        attributes: [
          {name: 'id', value: 'lnk1'},
          {name: 'rel', value: 'stylesheet'},
          {name: 'type', value: 'text/css'},
          {
            name: 'href',
            value: cssPath,
          },
          {name: 'disabled', value: ''},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'LINK',
        attributes: [
          {name: 'id', value: 'lnk2'},
          {name: 'rel', value: 'stylesheet'},
          {name: 'type', value: 'text/css'},
          {
            name: 'href',
            value: cssPath,
          },
          {name: 'disabled', value: ''},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n      '},
      {
        nodeType: 1,
        nodeName: 'LINK',
        attributes: [
          {name: 'id', value: 'lnk3'},
          {name: 'rel', value: 'stylesheet'},
          {name: 'type', value: 'text/css'},
          {
            name: 'href',
            value: cssPath,
          },
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n    '},
      {nodeType: 1, nodeName: 'HEAD', attributes: [], childNodeIndexes: [1, 2, 3, 4, 5, 6]},
      {nodeType: 1, nodeName: 'BODY', attributes: [], childNodeIndexes: []},
      {nodeType: 1, nodeName: 'HTML', attributes: [], childNodeIndexes: [7, 8]},
    ];

    return new Promise((resolve, reject) => {
      docNode.defaultView.onload = () => {
        try {
          docNode.getElementById('lnk1').sheet.disabled = true;
          docNode.getElementById('lnk3').removeAttribute('disabled');
          const {cdt} = domNodesToCdt(docNode);
          expect(cdt).to.eql(expectedCdt);
          resolve();
        } catch (err) {
          reject(err);
        } finally {
          server.close();
        }
      };
    });
  });

  it('returns style tags with a disabled styleSheet', () => {
    const docNode = getDocNode(`
      <style id="stl"></style>
    `);
    docNode.getElementById('stl').sheet.disabled = true;
    const {cdt} = domNodesToCdt(docNode);

    const expectedCdt = [
      {nodeType: 9, childNodeIndexes: [5]},
      {
        nodeType: 1,
        nodeName: 'STYLE',
        attributes: [
          {name: 'id', value: 'stl'},
          {name: 'data-applitools-disabled', value: ''},
        ],
        childNodeIndexes: [],
      },
      {nodeType: 3, nodeValue: '\n    '},
      {
        nodeType: 1,
        nodeName: 'HEAD',
        attributes: [],
        childNodeIndexes: [1, 2],
      },
      {
        nodeType: 1,
        nodeName: 'BODY',
        attributes: [],
        childNodeIndexes: [],
      },
      {
        nodeType: 1,
        nodeName: 'HTML',
        attributes: [],
        childNodeIndexes: [3, 4],
      },
    ];
    expect(cdt).to.eql(expectedCdt);
  });

  //this is for generating the cdt files
  it.skip('works for test-iframe.html', () => {
    const docNode = getDocNode(loadFixture('test-iframe.html'));
    const {cdt} = domNodesToCdt(docNode);
    const iframeDocNode = getDocNode(loadFixture('iframes/frame.html'));
    const {iframeCdt} = domNodesToCdt(iframeDocNode);
    // fs.writeFileSync('test-iframe.cdt.json', JSON.stringify(cdt, null, 3));
    const expectedCdt = loadJsonFixture('test-iframe.cdt.json');
    const expectedFrameCdt = loadJsonFixture('inner-frame.cdt.json');
    expect(cdt).to.deep.equal(expectedCdt);
    expect(iframeCdt).to.deep.equal(expectedFrameCdt);
  });

  //this is for generating the cdt files
  it.skip('works for test-iframe.html', () => {
    const docNode = getDocNode(loadFixture('test-iframe.html'));
    const {cdt} = domNodesToCdt(docNode);
    const iframeDocNode = getDocNode(loadFixture('iframes/frame.html'));
    const iframeCdt = domNodesToCdt(iframeDocNode);
    // fs.writeFileSync('test-iframe.cdt.json', JSON.stringify(cdt, null, 3));
    const expectedCdt = loadJsonFixture('test-iframe.cdt.json');
    const expectedFrameCdt = loadJsonFixture('inner-frame.cdt.json');
    expect(cdt).to.deep.equal(expectedCdt);
    expect(iframeCdt).to.deep.equal(expectedFrameCdt);
  });
});
