images = require('../models/events.images.model')
files = require('../helpers/files')
auth = require('../middleware/authorize.middleware')
events = require('../models/events.model')

exports.view = async function(req, res) {

};

exports.set = async function(req, res) {
  const eventId = req.params.id
  extension = req.get('Content-Type')
  image = req.body
  try {
    if (auth.Authorized(req, res)) {
      currentEvent = events.getDetails(eventId);
      if (currentEvent.organizer_id === req.authenticatedUserId) {
        if (files.trySave(image.buffer, `event-hero-${eventId}`, extension)) {
          res.statusMessage = 'Created'
          res.status(201)
        } else if (files.trySave(image.buffer, `event-hero-${eventId}`, extension) === 'path already exists') {
          files.deleteFile(`event-hero-${eventId}`);
          files.trySave(image.buffer, `event-hero-${eventId}`, extension);
          res.statusMessage = 'OK'
          res.status(200)
             .send();
        } else {
          res.statusMessage = 'Not Found'
          res.status(404)
             .send()
        }
        res.statusMessage = 'Forbidden'
        res.status(403)
           .send()
      }
    } else {
      res.statusMessage = 'Unauthorized'
      res.status(401)
         .send()
    }
  } catch (err) {
    console.log(err)
    res.statusMessage = 'Server Error'
    res.status(500)
       .send()
  }


};
