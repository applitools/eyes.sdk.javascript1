const fs = require('fs');
const path = require('path');

function saveFixture(name, content) {
  fs.writeFileSync(path.resolve(__dirname, `../fixtures/${name}`), content);
}

module.exports = saveFixture;
