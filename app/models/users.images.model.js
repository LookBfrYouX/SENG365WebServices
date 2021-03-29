const db = require('../../config/db');

exports.saveImage = async function(userId, file) {
  try {
    const conn = await db.getPool().getConnection();
    const query = 'UPDATE user SET image_filename = ' + file + ' WHERE id = ' + userId;
    await conn.query(query);
    conn.release();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.getImage = async function(userId) {
  try {
    const conn = await db.getPool().getConnection();
    const query = 'SELECT image_filename FROM user WHERE id = ' + userId;
    [rows] = await conn.query(query);
    conn.release();
    return rows
  } catch (err) {
    console.log(err);
    throw err;
  }
}

exports.deleteImage = async function(userId) {
  try {
    const conn = await db.getPool().getConnection();
    const query = 'UPDATE user SET image_filename = NULL WHERE id = ' + userId;
    await conn.query(query);
    conn.release();
  } catch (err) {
    console.log(err);
    throw err;
  }
};
