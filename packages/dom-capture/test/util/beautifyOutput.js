'use strict';

function beautifyOutput(dom) {
  const {meta, parts} = parseOutput(dom);
  let beautifullStr = `${JSON.stringify(meta)}`;
  for (let i = 0; i < 3; i++) {
    if (i > 0) {
      beautifullStr += `\n${meta.separator}`;
    }

    if (parts[i].length > 0) {
      if (parts[i].startsWith('{')) {
        beautifullStr += `\n${JSON.stringify(JSON.parse(parts[i]), null, 2)}`;
      } else {
        beautifullStr += `\n${parts[i]}`;
      }
    }
  }
  return beautifullStr;
}
function getPerformanceMetrics(output) {
  const {parts} = parseOutput(output);
  if (parts[3]) {
    return JSON.parse(parts[3]);
  }
}

function parseOutput(output) {
  const items = output.split('\n');
  const meta = JSON.parse(items[0]);
  const {separator} = meta;
  const parts = [];
  let part = '';
  for (let i = 1; i < items.length; i++) {
    if (items[i] == separator) {
      parts.push(part);
      part = '';
    } else {
      if (part != '') {
        part += '\n';
      }
      part += items[i];
    }
  }
  if (part != '') {
    parts.push(part);
  }
  return {meta, parts};
}
module.exports = {beautifyOutput, getPerformanceMetrics};
