images = require('../models/events.images.model')
files = require('../helpers/files')
auth = require('../middleware/authorize.middleware')
events = require('../models/events.model')
eventImages = require('../models/events.images.model')

exports.view = async function(req, res) {
  const eventId = req.params.id
  try {
    const imagePath = (await eventImages.getImage(eventId))[0];
    if (imagePath) {
      res.statusMessage = 'OK';
      res.status(200)
         .sendFile(require.main.path + '\\storage\\images\\' + imagePath.image_filename);
    } else {
      res.statusMessage = 'Not Found'
      res.status(404)
         .send()
      }
  } catch (err) {
    console.log(err)
    res.statusMessage = 'Server Error'
    res.status(500)
       .send()
  }
};

exports.set = async function(req, res) {
  const eventId = req.params.id
  extension = req.get('Content-Type')
  const image = req.body
  currentEvent = (await events.getDetails(parseInt(eventId)))[0];
  try {
    if (currentEvent) {
      if (await auth.Authorized(req, res)) {
        if (currentEvent.organizer_id === req.authenticatedUserId) {
          if (await files.saveFile(image, `event_${eventId}`, extension)) {
            await eventImages.saveImage(parseInt(eventId), `'event_${eventId}.${files.extensions[extension]}'`)
            res.statusMessage = 'Created'
            res.status(201)
               .send()
          } else {
            files.deleteFile(`event_${eventId}`);
            files.saveFile(image.buffer, `event_${eventId}`, extension);
            res.statusMessage = 'OK'
            res.status(200)
               .send();
             }
        } else {
          res.statusMessage = 'Forbidden'
          res.status(403)
             .send()
        }
      } else {
        res.statusMessage = 'Unauthorized'
        res.status(401)
           .send()
      }

    } else {
      res.statusMessage = 'Not Found'
      res.status(404)
         .send()
    }

  } catch (err) {
    console.log(err)
    res.statusMessage = 'Server Error'
    res.status(500)
       .send()
  }
};
