/* global document */
'use strict';
const {describe, before, after, it} = require('mocha');
const {expect} = require('chai');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const testServer = require('./util/testServer');
const {getProcessPageAndSerialize} = require('../index');
const {loadJsonFixture} = require('./util/loadFixture');

describe('processInlineCss', () => {
  let server;
  let browser;
  let page;
  let processPage;
  let getCssom;

  async function extract(page) {
    const {cdt} = await page.evaluate(processPage);
    return cdt
      .filter(node => node.nodeName === 'STYLE')
      .reduce((styles, node) => {
        return styles.then(async styles => {
          const idAttr = node.attributes.find(attr => attr.name === 'id');
          if (idAttr) {
            const result = cdt[node.childNodeIndexes[0]].nodeValue;
            const cssom = await page.evaluate(getCssom, idAttr.value);
            styles[idAttr.value] = {result, cssom};
          }
          return styles;
        });
      }, Promise.resolve({}));
  }

  before(async () => {
    processPage = `(${await getProcessPageAndSerialize()})(document, {dontFetchResources: true})`;
    getCssom = styleId =>
      Array.from(document.getElementById(styleId).sheet.cssRules, rule =>
        rule.cssText.replace(/\n+|\s{2,}/g, ' '),
      ).join(' ');
    server = await testServer({port: 7373});
    browser = await puppeteer.launch({headless: true});
    page = await browser.newPage();

    page.on('console', msg => console.log(msg.text()));
  });

  after(async () => {
    await browser.close();
    await server.close();
  });

  it('works for syntax errors', async () => {
    await page.goto('http://localhost:7373/cssom/syntax-errors.html');
    const styles = await extract(page);

    expect(styles['wrong_block'].cssom).to.be.eql('body { } body { color: yellow; }');
    expect(styles['wrong_block'].result).to.be.eql('body{{} color: red}body{}body{color:yellow}');

    expect(styles['wrong_selector'].cssom).to.be.eql('body { color: yellow; }');
    expect(styles['wrong_selector'].result).to.be.eql('$body{color:red}body{color:yellow}');
  });

  it('works for vendor specific properties', async () => {
    await page.goto('http://localhost:7373/cssom/vendor-properties.html');
    const styles = await extract(page);

    expect(styles['vendor_specific_properties'].cssom).to.be.eql(
      'body { -webkit-appearance: none; }',
    );
    expect(styles['vendor_specific_properties'].result).to.be.eql(
      'body{-webkit-appearance:none;-moz-appearance:none}',
    );
  });

  it('works for vendor specific values', async () => {
    await page.goto('http://localhost:7373/cssom/vendor-values.html');
    const styles = await extract(page);

    expect(styles['vendor_specific_values'].cssom).to.be.eql('body { position: sticky; }');
    expect(styles['vendor_specific_values'].result).to.be.eql(
      'body{position:-webkit-sticky;position:sticky}',
    );
  });

  it('works for vendor specific rules', async () => {
    await page.goto('http://localhost:7373/cssom/vendor-rules.html');
    const styles = await extract(page);

    expect(styles['vendor_specific_atrules'].cssom).to.be.eql(
      '@-webkit-keyframes fade { 0% { opacity: 1; }  100% { opacity: 0; } } ' +
        '@keyframes fade { 0% { opacity: 1; }  100% { opacity: 0; } }',
    );
    expect(styles['vendor_specific_atrules'].result).to.be.eql(
      '@-moz-keyframes fade{0%{opacity:1}100%{opacity:0}}' +
        '@-webkit-keyframes fade{0%{opacity:1}100%{opacity:0}}' +
        '@keyframes fade{0%{opacity:1}100%{opacity:0}}',
    );

    // this doesn't go through the cssom path so it's an exceptional case
    expect(styles['vendor_specific_single_atrule'].cssom).to.equal('');
    expect(styles['vendor_specific_single_atrule'].result.trim()).to.equal(
      '@-moz-keyframes fade {from {opacity: 1;}to {opacity: 0;}}',
    );
  });

  it('works for vendor specific selectors', async () => {
    await page.goto('http://localhost:7373/cssom/vendor-selectors.html');
    const styles = await extract(page);

    expect(styles['vendor_specific_selectors'].cssom).to.be.eql(
      'input:-webkit-autofill { color: hotpink; }',
    );
    expect(styles['vendor_specific_selectors'].result).to.be.eql(
      'input:-moz-autofill{color:hotpink}input:-webkit-autofill{color:hotpink}',
    );
  });

  it('works for vendor specific shorthands', async () => {
    await page.goto('http://localhost:7373/cssom/vendor-shorthands.html');
    const styles = await extract(page);

    expect(styles['vendor_specific_shorthands'].cssom).to.be.eql('body { -webkit-mask: none; }');
    expect(styles['vendor_specific_shorthands'].result).to.be.eql('body{-webkit-mask:none}');
  });

  it('works for programmatically generated style tags', async () => {
    await page.goto('http://localhost:7373/cssom/programmatically-generated-stylesheet.html');
    const styles = await extract(page);

    expect(styles['programmatically_generated_stylesheet'].cssom).to.be.eql(
      'body { color: blue; } div, span { font-size: 20px; }',
    );
    expect(styles['programmatically_generated_stylesheet'].result).to.be.eql(
      'body{color:blue}div,span{font-size:20px}',
    );
  });

  it('works for programmatically added rules', async () => {
    await page.goto('http://localhost:7373/cssom/programmatically-added-rules.html');
    const styles = await extract(page);

    expect(styles['programmatically_added_rules'].cssom).to.be.eql(
      'body { color: red; } body { color: blue; }',
    );
    expect(styles['programmatically_added_rules'].result).to.be.eql(
      'body{color:red}body{color:blue}',
    );
  });

  it('works for programmatically added style properties', async () => {
    await page.goto('http://localhost:7373/cssom/programmatically-added-properties.html');
    const styles = await extract(page);

    expect(styles['programmatically_added_properties'].cssom).to.be.eql(
      'body { color: red; font-size: 1.5em !important; }',
    );
    expect(styles['programmatically_added_properties'].result).to.be.eql(
      'body{color:red;font-size:1.5em!important}',
    );
  });

  it('works for grouping rules', async () => {
    await page.goto('http://localhost:7373/cssom/nested-rules.html');
    const styles = await extract(page);

    expect(styles['nested_rules'].cssom).to.be.eql(
      '@media screen {  body { font-weight: 700; }  body { color: yellow; } }',
    );
    expect(styles['nested_rules'].result).to.be.eql(
      '@media screen{body{font-weight:700}body{color:yellow}}',
    );
  });

  it('works for simple atrules', async () => {
    await page.goto('http://localhost:7373/cssom/simple-atrules.html');
    const styles = await extract(page);

    expect(styles['simple_atrules'].cssom).to.be.eql(
      '@import url("url.css"); @namespace svg url("url.namespace");',
    );
    expect(styles['simple_atrules'].result).to.be.eql(
      '@charset "utf8";@import url("url.css");@namespace svg url("url.namespace");',
    );
  });

  it('works for simple shorthand', async () => {
    await page.goto('http://localhost:7373/cssom/shorthand-simple.html');
    const styles = await extract(page);

    expect(styles['shorthand_simple'].cssom).to.be.eql('body { background: white; }');
    expect(styles['shorthand_simple'].result).to.be.eql('body{background:white}');
  });

  it('works for shorthand override css properties', async () => {
    await page.goto('http://localhost:7373/cssom/shorthand-override.html');
    const styles = await extract(page);

    expect(styles['shorthand_override'].cssom).to.be.eql(
      'body { background: linear-gradient(white, whitesmoke); }',
    );
    expect(styles['shorthand_override'].result).to.be.eql(
      'body{background:white;background:linear-gradient(white, whitesmoke)}',
    );
  });

  it('works for shorthand with variables', async () => {
    await page.goto('http://localhost:7373/cssom/shorthand-with-vars.html');
    const styles = await extract(page);

    expect(styles['shorthands_with_vars'].cssom).to.be.eql(
      ':root { --bg-image: #ff0; } body { background-image: ; background-size: ; background-repeat-x: ; background-repeat-y: ; background-attachment: ; background-origin: ; background-clip: ; background-color: ; background-position: center center; }',
    );
    expect(styles['shorthands_with_vars'].result).to.be.eql(
      ':root{--bg-image: #ff0}body{background:var(--bg-image);background-position:center}',
    );
  });

  it('works for longhand set which could be replaced with shorthand', async () => {
    await page.goto('http://localhost:7373/cssom/shorthand-replaceable.html');
    const styles = await extract(page);

    expect(styles['shorthand_replaceable'].cssom).to.be.eql('body { place-content: center; }');
    expect(styles['shorthand_replaceable'].result).to.be.eql(
      'body{justify-content:center;align-content:center}',
    );
  });

  it('works for experimental longhands', async () => {
    await page.goto('http://localhost:7373/cssom/longhand-experimental.html');
    const styles = await extract(page);

    expect(styles['longhand_experimental'].cssom).to.be.eql(
      'body { background-position: center bottom -4rem; background-repeat: no-repeat; }',
    );
    expect(styles['longhand_experimental'].result).to.be.eql(
      'body{background-position:center bottom -4rem;background-repeat:no-repeat}',
    );
  });
});

describe('processInlineCss works for large css', () => {
  let server;
  let browser;
  let page;
  let cdt;

  before(async () => {
    const processPage = `(${await getProcessPageAndSerialize()})(document, {dontFetchResources: true,})`;
    server = await testServer({port: 7373});
    browser = await puppeteer.launch({headless: true});
    page = await browser.newPage();
    const url = 'http://localhost:7373/cssom/large-css.html';
    await page.goto(url);
    // console.time('@');
    cdt = (await page.evaluate(processPage)).cdt;
    // console.timeEnd('@');
  });

  after(async () => {
    await browser.close();
    await server.close();
  });

  it('works for large stylesheets', () => {
    if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
      const cdtStr = JSON.stringify(cdt, null, 2);
      fs.writeFileSync(
        path.resolve(__dirname, 'fixtures/cssom/large-css.puppeteer.cdt.json'),
        cdtStr,
      );
    }
    const expectedCdt = loadJsonFixture('cssom/large-css.puppeteer.cdt.json');

    expect(cdt).to.eql(expectedCdt);
  });
});
