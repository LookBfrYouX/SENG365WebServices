const attendees = require('../models/events.attendees.model')
const events = require('../models/events.model')
const auth = require('../middleware/authorize.middleware')

exports.view = async function(req, res) {
  try {
    await auth.Authorized(req, res)
    const eventId = req.params.id;
    const results = await attendees.getEventAttendees(parseInt(eventId));
    const organizerId = (await events.getDetails(parseInt(eventId)))[0].organizer_id
    if (results.length) {
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
    } else {
      res.statusMessage = 'Not Found'
      res.status(404)
          .send()
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
      var attendeeIds = [];
      const date = new Date();
      eventDate = (await events.getDetails(parseInt(eventId)))[0].date;
      for (let i = 0; i < eventAttendees.length; i++) {
        attendeeIds.push(eventAttendees[i].attendeeId)
      }
      if (eventDate) {
        if (attendeeIds.includes(userId) || eventDate.getTime() < date.getTime()) {
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
      const eventSelected = (await events.getDetails(parseInt(eventId)))[0];
      eventAttendees = await attendees.getEventAttendees(parseInt(eventId));
      attendance_status = (await attendees.getEventStatus(eventId, userId))[0];
      if (attendance_status) {
        console.log(attendance_status);
        const date = new Date();
        const eventDate = new Date(eventSelected.date);
        if (eventSelected.eventId) {
          if (eventDate.getTime() < date.getTime() || attendance_status.status === ('rejected' || undefined) ) {
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
        res.statusMessage = 'Forbidden';
        res.status(403)
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
  const eventId = req.params.id;
  const attendeeId = req.params.user_id
  const newStatus = req.body.status;
  try {
      Authorized = await auth.Authorized(req, res);
      userId = req.authenticatedUserId;
      eventAttendees = await attendees.getEventAttendees(parseInt(eventId));
      const event = (await events.getDetails(parseInt(eventId)))[0];
      organizerId = event.organizer_id
      if (Authorized) {
        if (userId === organizerId) {
          if (event) {
            if (newStatus === ('accepted' || 'pending' || 'rejected')) {
              attendees.changeEventStatus(eventId, attendeeId, newStatus);
              res.statusMessage = 'OK';
              res.status(400)
                 .send();
            } else {
              res.statusMessage = 'Bad Request';
              res.status(400)
                 .send();
            }
          } else {
            res.statusMessage = 'Not Found';
            res.status(404)
               .send();
          }
      } else {
        res.statusMessage = 'Forbidden';
        res.status(403)
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
