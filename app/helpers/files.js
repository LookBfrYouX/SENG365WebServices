const fs = require('fs');

const path = `\\storage\\images\\`
exports.extensions = {
  'image/jpg' : 'jpg',
  'image/jpeg' : 'jpeg',
  'image/gif' : 'gif',
  'image/png' : 'png'
};

exports.trySave = async function (buffer, name, mimeType) {
  try {
    if (fs.existsSync(path + `${name}.${this.extensions.mimeType}`)) {
      return 'path already exists'
    } else {
      await fs.writeFile(require.main.path + `\\storage\\images\\${name}.${this.extensions.mimeType}`, buffer, () => {});
      return true;
      }

  } catch (err) {
    return false;
  }
}

exports.deleteFile = async function (file) {
  try {
    await fs.unlink(require.main.path + '\\storage\\images\\' + file, () => {});
    return true;

  } catch (err) {
    return false;
  }
}
