'use strict';

const fs = require('fs');
const {promisify} = require('util');
const {resolve} = require('path');
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const URL = require('url').URL;
const DIR_NAME = '.applitools';

async function handleBrowserDebugData({frame, metaData = {}, dirPath = DIR_NAME, logger}) {
  if (
    !process.env.DEBUG_SAVE ||
    process.env.DEBUG_SAVE === '0' ||
    process.env.DEBUG_SAVE === 'false'
  ) {
    return;
  }

  const isMainDir = dirPath === DIR_NAME;
  let path = resolve(process.cwd(), dirPath);
  if (!fs.existsSync(path)) {
    await mkdir(path);
  }

  if (isMainDir) {
    path = resolve(path, `browser-snapshot-${new Date().toISOString()}`);
    await mkdir(path);
    logger.log(`resource data saved to ${path}`);
  }

  const sanitizeFileName = s => s.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  await Promise.all([
    createFrameData(frame, path),
    frame.frames.map(f =>
      handleBrowserDebugData({
        frame: f,
        dirPath: resolve(path, sanitizeFileName(f.url)),
        logger,
      }),
    ),
  ]);

  async function createFrameData(frame, dirPath) {
    await writeFile(resolve(dirPath, 'cdt.json'), JSON.stringify(frame.cdt, null, 2));
    await writeFile(
      resolve(dirPath, 'info.json'),
      JSON.stringify(
        Object.assign(metaData, {
          url: frame.url,
          srcAttr: frame.srcAttr,
        }),
        null,
        2,
      ),
    );
    await writeFile(
      resolve(dirPath, 'resourceUrls.json'),
      JSON.stringify(frame.resourceUrls, null, 2),
    );

    const resourcePath = resolve(dirPath, 'resourceContents');
    if (!fs.existsSync(resourcePath)) {
      await mkdir(resourcePath);
    }
    await Promise.all(
      Object.values(frame.resourceContents).map(
        async r => await writeFile(filePath(resourcePath, r.url), fileValue(r)),
      ),
    );
  }

  function filePath(resourcePath, fileUrl) {
    const fileName =
      (new URL(fileUrl).pathname &&
        new URL(fileUrl).pathname.match(/([^/]+)(?:\/?)$/) &&
        new URL(fileUrl).pathname.match(/([^/]+)(?:\/?)$/)[1]) ||
      'unknown';
    const type = (fileName.match(/(\..+)$/) && fileName.match(/(\..+)$/)[1]) || '';
    return resolve(resourcePath, `${fileName}-${Date.now()}${type}`);
  }

  function fileValue(resource) {
    if (resource.type && resource.type.includes('text')) {
      return resource.value.toString();
    } else {
      return resource.value;
    }
  }
}

module.exports = handleBrowserDebugData;
