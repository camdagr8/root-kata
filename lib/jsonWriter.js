
const beautify = require('beautify');
const path     = require('path');
const fs       = require('fs');

module.exports = (data, file) => {
    data = JSON.stringify(data);
    data = beautify(data, {format: 'json'});

    let dir = process.cwd();

    let filePath = path.normalize(path.join(dir, file));
    fs.writeFileSync(filePath, data, 'utf8');

    return filePath;
};
