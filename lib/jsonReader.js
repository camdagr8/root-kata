
const path = require('path');
const fs   = require('fs');

module.exports = (file) => {
    let dir = process.cwd();
    let filePath = path.normalize(path.join(dir, file));
    return JSON.parse(fs.readFileSync(filePath));
};
