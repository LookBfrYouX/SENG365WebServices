const attendees = require('../models/events.attendees.model')
const events = require('../models/events.model')
const password = require ('../helpers/passwords')
const auth = require('../middleware/authorize.middleware')

exports.view = async function(req, res) {
  try {
    await auth.Authorized(req, res)
    const eventId = req.params.id;
    const results = await attendees.getEventAttendees(parseInt(eventId));
    const organizerId = (await events.getDetails(parseInt(eventId)))[0].organizer_id
    console.log(organizerId)
    console.log(req.authenticatedUserId);
    if (req.authenticatedUserId === organizerId) {
      res.statusMessage = 'OK'
      res.status(200)
          .send(results)
    } else {
      var returnValues = [];
      for (i = 0; i < results.length; i++) {
        if (results[i].status === 'accepted' || (results[i].userId === req.authenticatedUserId && results[i].status === ('rejected' || 'pending'))) {
          returnValues.push(results[i])
        }
      }
      res.statusMessage = 'OK'
      res.status(200)
          .send(returnValues)
    }
  } catch (err) {
    console.log(err);
    res.statusMessage = 'Internal Server Error';
    res.status(500)
       .send();
  }
};

exports.request = async function(req, res) {
  eventId = req.params.id;
  try {
    if (await auth.Authorized(req, res)) {
      userId = req.authenticatedUserId;
      eventAttendees = await attendees.getEventAttendees(parseInt(eventId));
      const date = new Date();
      eventDate = (await events.getDetails(parseInt(eventId)))[0].date;
      if (eventDate) {
        if (eventAttendees.includes(userId) || eventDate.getTime() < date.getTime()) {
          res.statusMessage = 'Forbidden';
          res.status(403)
             .send();
        } else {
          await attendees.requestAttendance(eventId, userId, date.toISOString().slice(0, 19).replace('T', ' '));
          res.statusMessage = 'Created';
          res.status(201)
             .send();
        }
      } else {
        res.statusMessage = 'Not Found';
        res.status(404)
           .send();
      }

    } else {
      res.statusMessage = 'Unauthorized';
      res.status(401)
           .send();
    }
  } catch (err) {
    console.log(err);
    res.statusMessage = 'Internal Server Error';
    res.status(500)
       .send();
  }
};

exports.remove = async function(req, res) {
  eventId = req.params.id;
  try {
    if (await auth.Authorized(req, res)) {
      userId = req.authenticatedUserId;
      eventAttendees = await attendees.getEventAttendees(parseInt(eventId));
      attendance_status = await attendees.getEventStatus(eventId, userId)[0];
      const date = new Date();
      const event = (await events.getDetails(parseInt(eventId)))[0];
      const eventDate = new Date(event.date);
      console.log(eventDate);
      if (eventDate) {
        console.log(date);
        if (eventDate.getTime() < date.getTime() || attendance_status === ('rejected' || undefined) ) {
          res.statusMessage = 'Forbidden';
          res.status(403)
             .send();
        } else {
          await attendees.removeAttendance(eventId, userId);
          res.statusMessage = 'OK';
          res.status(200)
             .send();
        }
      } else {
        res.statusMessage = 'Not Found';
        res.status(404)
           .send();
      }
    } else {
      res.statusMessage = 'Unauthorized';
      res.status(401)
           .send();
    }
  } catch (err) {
    console.log(err);
    res.statusMessage = 'Internal Server Error';
    res.status(500)
       .send();
  }
};

exports.edit = async function(req, res) {
  return null;
};
