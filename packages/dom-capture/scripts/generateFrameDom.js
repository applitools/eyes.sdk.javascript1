const {makeTiming} = require('@applitools/monitoring-commons');
const {getCaptureDomScript} = require('../');
const {testServer} = require('@applitools/sdk-shared');
const path = require('path');
const fs = require('fs');

if (process.argv[2] === '--run') {
  main();
}

module.exports = generateDom;

async function generateDom({timeItAsync, page, url}) {
  await page.goto(url);
  const script = `(${await getCaptureDomScript()})()`;
  return timeItAsync('captureFrame', () => page.evaluate(script));
}

async function main() {
  const {performance, timeItAsync} = makeTiming();
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log(msg.args().join(' '));
  });

  const server1 = await testServer({port: 5000});
  const server2 = await testServer({port: 7272});

  const url = 'http://localhost:5000/v4.html';
  const domStr = await generateDom({timeItAsync, page, url});
  console.log('captureFrame took', performance['captureFrame']);
  fs.writeFileSync(path.resolve(__dirname, 'v4.dom.json'), domStr);
  await browser.close();
  await server1.close();
  await server2.close();
}
