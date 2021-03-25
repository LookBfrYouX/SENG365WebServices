const db = require('../../config/db');

exports.getDetails = async function(id){
  const conn = await db.getPool().getConnection();
  const query = `SELECT event.id, event.title, user.first_name AS organizerFirstName, user.last_name AS organizerLastName, COUNT(event_attendees.id) as , event.description, event.date, event.is_online, event.url, event.venue, event.requires_attendance_control, event.fee, event.organizer_id
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
                 FROM events_category`;
  const [ rows ] = await conn.query( query, [id] );
  conn.release();
  return rows;
}

exports.addEvent = async function(query, values, userId) {
  try {
    const conn = await db.getPool().getConnection();
    const query = 'UPDATE event SET ' + params + ' WHERE id = ?;'
    await conn.query( query, [id] );
    conn.release();
  } catch (err) {
    console.log(err);
    throw err;

  }

}
