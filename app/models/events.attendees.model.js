const db = require('../../config/db');

exports.getEventAttendees = async function(eventid) {
  try {
    const conn = await db.getPool().getConnection();
    query = `SELECT event_attendees.user_id as attendeeId, attendance_status.name as status,
             user.first_name as firstName, user.last_name as lastName,
             event_attendees.date_of_interest as dateOfInterest
             FROM event_attendees
             JOIN attendance_status ON event_attendees.attendance_status_id = attendance_status.id
             JOIN user ON event_attendees.user_id = user.id
             WHERE event_attendees.event_id = ` + eventid + `
             ORDER BY dateOfInterest DESC`;
    const [rows] = await conn.query(query);
    conn.release();
    return rows;
  } catch (err) {
    console.log(err);
    throw(err);
  }
}

exports.getEventStatus = async function(eventId, userId) {
  try {
    const conn = await db.getPool().getConnection();
    query = `SELECT attendance_status.name as status
             FROM event_attendees
             JOIN attendance_status ON event_attendees.attendance_status_id = attendance_status.id
             JOIN user ON event_attendees.user_id = user.id
             WHERE event_attendees.event_id = ` + eventId + `
             AND user.id = ` + userId
    const [rows] = await conn.query(query);
    conn.release();
    return rows;
  } catch (err) {
    console.log(err);
    throw(err);
  }
}

exports.changeEventStatus = async function(eventId, userId, attendanceId) {
  try {
    const conn = await db.getPool().getConnection();
    query = `INSERT INTO event_attendees (attendance_status_id = ` + attendanceId + `)
             WHERE event_id = ` + eventId + `
             AND user.id = ` + userId
    const [rows] = await conn.query(query);
    conn.release();
    return rows;
  } catch (err) {
    console.log(err);
    throw(err);
  }
}

exports.requestAttendance = async function(eventId, userId, date) {
  try {
    console.log(date)
    const conn = await db.getPool().getConnection();
    query =  `INSERT INTO event_attendees (event_id, user_id, attendance_status_id, date_of_interest) VALUES (` + eventId + `, ` + userId + `, ` + `2, '` + date + `');`;
    console.log(query)
    const [rows] = await conn.query(query);
    conn.release();
    return rows;
  } catch (err) {
    console.log(err);
    throw(err);
  }
}

exports.removeAttendance = async function(eventId, userId) {
  try {
    const conn = await db.getPool().getConnection();
    query =  `DELETE FROM event_attendees WHERE event_id = ? and user_id = ?;`;
    const [rows] = await conn.query(query, [eventId, userId]);
    conn.release();
    return rows;
  } catch (err) {
    console.log(err);
    throw(err);
  }
}
