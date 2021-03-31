images = require('../models/users.images.model')
auth = require('../middleware/authorize.middleware')
users = require('../models/users.images.model')
files = require('../helpers/files')

exports.get = async function(req, res) {
  const userId = req.params.id;
  try {
    const imagePath = (await images.getImage(userId))[0].image_filename;
    if (imagePath) {
      res.statusMessage = 'OK';
      res.status(200)
         .sendFile(require.main.path + '\\storage\\images\\' + imagePath);
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
  };
};

exports.set = async function(req, res) {
  const userId = req.params.id;
  const extension = req.get('Content-Type')
  const image = req.body;
  const userToChange = await users.searchUserBy('id = ' + userId);
  try {
    if (userToChange.length) {
      if (await auth.Authorized(req, res)) {
        if (parseInt(userId) === req.authenticatedUserId) {
          console.log(userToChange)
          if ((userToChange[0].image_filename)) {
            await files.deleteFile(`user_${userId}`);
            await files.saveFile(image, `event_${userId}`, extension);
            await images.saveImage(parseInt(userId), `'user_${userId}.${files.extensions[extension]}'`);
            res.statusMessage = 'OK'
            res.status(200)
                .send();
          } else if (await files.saveFile(image, `event_${userId}`, extension)) {
            await images.saveImage(parseInt(userId), `'user_${userId}.${files.extensions[extension]}'`);
            res.statusMessage = 'Created'
            res.status(201)
                .send()
          } else {
              res.statusMessage = 'Bad Request'
              res.status(400)
                  .send()
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

exports.delete = async function(req, res) {
  const userId = req.params.id;
  extension = req.get('Content-Type')
  image = req.body
  const userToChange = await users.searchUserBy('id = ' + userId);
  console.log(userToChange)
  const imagePath = (await images.getImage(userId))[0].image_filename;
  try {
    if (userToChange.length) {
      if (await auth.Authorized(req, res)) {
        if (parseInt(userId) === req.authenticatedUserId) {
            await files.deleteFile(imagePath);
            await images.deleteImage(parseInt(userId));
            res.statusMessage = 'OK'
            res.status(200)
                .send()
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
