const db = require('../../config/db');

exports.saveImage = async function(eventId, file) {
  try {
    const conn = await db.getPool().getConnection();
    const query = 'UPDATE event SET image_filename = ' + file + ' WHERE id = ' + eventId;
    await conn.query(query);
    conn.release();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.getImage = async function(eventId) {
  try {
    const conn = await db.getPool().getConnection();
    const query = 'SELECT image_filename FROM event WHERE id = ' + eventId;
    [rows] = await conn.query(query);
    conn.release();
    return rows
  } catch (err) {
    console.log(err);
    throw err;
  }
}
