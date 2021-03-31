const fs = require('fs');

exports.extensions = {
  'image/jpg' : 'jpg',
  'image/jpeg' : 'jpeg',
  'image/gif' : 'gif',
  'image/png' : 'png'
};

exports.saveFile = async function (buffer, name, mimeType) {
  try {
    console.log('written file')
    await fs.writeFile(require.main.path + `\\storage\\images\\${name}.${this.extensions[mimeType]}`, buffer, () => {});
    return 1;

  } catch (err) {
    console.log(err)
    return 0;
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
