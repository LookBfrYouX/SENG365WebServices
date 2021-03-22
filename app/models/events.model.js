const db = require('../../config/db');

exports.getDetails = async function(id){
  const conn = await db.getPool().getConnection();
  const query = `SELECT event.id, event.title, user.firstname AS organizerFirstName, user.lastname AS organizerLastName, COUNT(event_attendees.id), event.description, event.date, event.is_online, event.url, event.venue, event.requires_attendance_control, event.fee, event.organizer_id 
                 FROM (event 
                 JOIN user ON user.id=event.organiser_id 
                 JOIN event_attendees ON event.id = event_attendees.event_id
                 WHERE event.id = ?`;
  const [ rows ] = await conn.query( query, [id] );
  conn.release();
return rows;
};

