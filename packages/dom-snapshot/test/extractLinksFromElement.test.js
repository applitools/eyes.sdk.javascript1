'use strict';

const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const extractLinksFromElement = require('../src/browser/extractLinksFromElement');
const testServer = require('@applitools/sdk-shared/src/run-test-server');
const getDocNode = require('./util/getDocNode');

describe('extractLinksFromElement', () => {
  let server;
  before(async () => {
    server = await testServer({port: 7373});
  });

  after(async () => {
    await server.close();
  });

  it('works', async () => {
    const doc = await getDocNode(`<html>
    <head>
      <link rel="stylesheet" href="style.css"/>
      <link rel="stylesheet" href="http://bla/style.css"/>
      <link rel="canonical" href="http://bla/canonical"/>
    </head>
    <body>
      <img src="blob:http://www.google.com/cat.jpg"/>
      <img src="http://www.google.com/body.jpg"/>
      <img src="http://www.google.com/body.jpg"/>
      <input type="image" src="http://www.google.com/input-image.jpg">
      <!-- url with descriptor comma separated -->
      <img srcset="smurfs.jpg?x=12,y=13 151w,gargamel.jpg 1154w"
        sizes="(max-width: 768px) 151px,750px"
        src="smurfs.jpg" alt="Smurfs on small screen, gargamel on large"/>
      <!-- url with descriptor comma+space separated -->
      <img srcset="smurfs.jpg?x=12,y=13 151w, gargamel.jpg 1154w"
        sizes="(max-width: 768px) 151px,750px"
        src="smurfs.jpg" alt="Smurfs on small screen, gargamel on large"/>
      <!-- url without descriptor comma+space separated -->
      <img srcset="smurfs.jpg?x=12,y=13, gargamel.jpg 1154w"
        sizes="(max-width: 768px) 151px,750px"
        src="smurfs.jpg" alt="Smurfs on small screen, gargamel on large"/>
      <video poster="/path/to/poster.jpg">
        <source src="/path/to/video.mp4" type="video/mp4">
      </video>
      <video src="/path/to/src/attr/video.mp4"></video>
      <audio controls src="/path/to/sound.mp3">
        Your browser does not support the
        <code>audio</code> element.
      </audio>
      <audio controls>
        <source src="sourceTag.ogg" type="audio/ogg">
        <source src="sourceTag.mp3" type="audio/mpeg">
        Your browser does not support the audio tag.
      </audio>
    </body>
  </html>
  `);
    const result = [...doc.querySelectorAll('*')]
      .map(extractLinksFromElement)
      .reduce((acc, arr) => acc.concat(arr), []);

    expect(result.sort()).to.eql(
      [
        'smurfs.jpg?x=12,y=13',
        'gargamel.jpg',
        'smurfs.jpg?x=12,y=13',
        'gargamel.jpg',
        'smurfs.jpg?x=12,y=13',
        'gargamel.jpg',
        'blob:http://www.google.com/cat.jpg',
        'http://www.google.com/body.jpg',
        'http://www.google.com/body.jpg',
        'http://www.google.com/input-image.jpg',
        'smurfs.jpg',
        'smurfs.jpg',
        'smurfs.jpg',
        '/path/to/video.mp4',
        '/path/to/src/attr/video.mp4',
        '/path/to/sound.mp3',
        'style.css',
        'http://bla/style.css',
        '/path/to/poster.jpg',
        'sourceTag.ogg',
        'sourceTag.mp3',
      ].sort(),
    );
  });

  it('works for svg', async () => {
    const doc = getDocNode(`<html>
    <head>
    </head>
    <body>
      <h1>SVG G!</h1>
        <br/><div>svg with image tag, xlink:href and jpg file</div>
      <svg width="200" height="200"
        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <image xlink:href="smurfs.jpg#hihi" height="200" width="200"/>
      </svg>

      <br/><div>svg with image tag, href and jpg file</div>
      <svg width="200" height="200"
        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <image href="smurfs1.jpg#hihi" height="200" width="200"/>
      </svg>

      <br/><div>svg with image tag and svg file </div>
      <svg width="200" height="200"
        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <!-- external resources r not shown in img tag inside svg -->
        <image href="basic.svg#hihi" height="200" width="200"/>
      </svg>

      <br/><div>svg with use tag and svg file</div>
      <svg>
        <use xlink:href="basic2.svg#img"></use>
      </svg>

      <br/><div>object tag with svg file</div>
      <object data="basic3.svg#img" type="image/svg+xml"></object>

      <br/><div>svg with use tag and internal anchor</div>
      <svg>
        <use xlink:href="#ignore-me"></use>
      </svg>
      <link rel="stylesheet" type="text/css" href="svg.css">

      <br/><div>svg style tag</div>
      <object data="with-style.svg" type="image/svg+xml"></object>
    </body>
  </html>`);

    const result = [...doc.querySelectorAll('*')]
      .map(extractLinksFromElement)
      .reduce((acc, arr) => acc.concat(arr), []);

    expect(result.sort()).to.eql(
      [
        'smurfs.jpg#hihi',
        'smurfs1.jpg#hihi',
        'basic.svg#hihi',
        'basic2.svg#img',
        'svg.css',
        'basic3.svg#img',
        'with-style.svg',
      ].sort(),
    );
  });
});
