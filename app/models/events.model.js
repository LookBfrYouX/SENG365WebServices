const db = require('../../config/db');

exports.getDetails = async function(id){
  const conn = await db.getPool().getConnection();
  const query = `SELECT event.id, event.title, user.first_name AS organizerFirstName, user.last_name AS organizerLastName, COUNT(event_attendees.id) as numAcceptedAttendees, event.description, event.date, event.is_online, event.url, event.venue, event.requires_attendance_control, event.fee, event.organizer_id
                 FROM event
                 JOIN user ON user.id=event.organizer_id
                 JOIN event_attendees ON event.id = event_attendees.event_id
                 WHERE event.id = ?`;
  const [ rows ] = await conn.query( query, [id] );
  conn.release();
  return rows;
};

exports.getCategories = async function() {
  const conn = await db.getPool().getConnection();
  const query = `SELECT id
                 FROM category`;
  const [ rows ] = await conn.query( query );
  conn.release();
  return rows;
}

// exports.getCategories = async function(Id) {
//   const conn = await db.getPool().getConnection();
//   const query = `SELECT id
//                  FROM category
//                  WHERE event_id =` + Id;
//   const [ rows ] = await conn.query( query );
//   conn.release();
//   return rows;
// }

exports.getCategoriesDetails = async function() {
  try {
    const conn = await db.getPool().getConnection();
    const query = `SELECT * FROM category`
    const [ rows ] = await conn.query( query );
    conn.release();
    return rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

exports.addEvent = async function(params, values) {
  try {
    const conn = await db.getPool().getConnection();
    const query = 'INSERT INTO event (' + params + ') VALUES (' + values + ');';
    await conn.query(query);
    conn.release();
  } catch (err) {
    console.log(err);
    throw err;
  }
}

exports.editEvent = async function(params, id) {
  try {
    const conn = await db.getPool().getConnection();
    const query = 'UPDATE event SET ' + params + ' WHERE id = ?';
    await conn.query(query, [id]);
    conn.release();
  } catch (err) {
    console.log(err);
    throw err;
  }
}

exports.searchEventBy = async function(params) {
  try {
    const conn = await db.getPool().getConnection();
    const query = 'SELECT * FROM event WHERE ' + params + ';';
    const [ rows ] = await conn.query(query);
    conn.release();
    return rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

exports.addCategory = async function(eventId, categoryId) {
  try {
    const conn = await db.getPool().getConnection();
    const query = "INSERT INTO `event_category` (`event_id`, `category_id`) VALUES (" + eventId + ", " + categoryId + ");";
    await conn.query(query);
    conn.release();
  } catch (err) {
    console.log(err);
    throw err;
  }
}

exports.deleteAttendees = async function(eventId) {
  try {
    const conn = await db.getPool().getConnection();
    const query = 'DELETE FROM event_attendees WHERE event_id = ' + eventId;
    await conn.query(query);
    conn.release();
  } catch (err) {
    console.log(err);
    throw err;
  }
}

exports.deleteEvent = async function(eventId) {
  try {
    const conn = await db.getPool().getConnection();
    const query = 'DELETE FROM event WHERE id = ' + eventId;
    await conn.query(query);
    conn.release();
  } catch (err) {
    console.log(err);
    throw err;
  }
}

exports.deleteCategories = async function(eventId) {
  try {
    const conn = await db.getPool().getConnection();
    const query = 'DELETE FROM event_category WHERE event_id = ' + eventId;
    await conn.query(query);
    conn.release();
  } catch (err) {
    console.log(err)
    throw err;
  }
}
