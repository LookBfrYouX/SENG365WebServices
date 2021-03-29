const fs = require('fs');

exports.extensions = {
  'image/jpg' : 'jpg',
  'image/jpeg' : 'jpeg',
  'image/gif' : 'gif',
  'image/png' : 'png'
};

exports.saveFile = async function (buffer, name, mimeType) {
  try {
    if (fs.existsSync(require.main.path + `\\storage\\images\\${name}.${this.extensions[mimeType]}`)) {
      return false;
    } else {
      await fs.writeFile(require.main.path + `\\storage\\images\\${name}.${this.extensions[mimeType]}`, buffer, () => {});
      return true;
      }

  } catch (err) {
    console.log(err)
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
