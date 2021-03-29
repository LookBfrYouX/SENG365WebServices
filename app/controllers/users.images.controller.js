images = require('../models/users.images.model')
auth = require('../middleware/authorize.middleware')
users = require('../models/users.images.model')

exports.get = async function(req, res) {
  const userId = req.params.id
  console.log('called function')
  try {
    const imagePath = (await images.getImage(userId))[0].image_filename;
    console.log(imagePath)
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
  };
};

exports.set = async function(req, res) {
  const userId = req.params.id;
  extension = req.get('Content-Type')
  const image = req.body;
  console.log(image)
  try {
    if (image) {
      if (await auth.Authorized(req, res)) {
        if (parseInt(userId) === req.authenticatedUserId) {
          if (await files.saveFile(image, `user_${userId}`, extension)) {
            await images.saveImage(parseInt(userId), `'user_${userId}.${files.extensions[extension]}'`)
            res.statusMessage = 'Created'
            res.status(201)
                .send()
          } else {
            files.deleteFile(`user_${userId}`);
            files.saveFile(image.buffer, `event_${userId}`, extension);
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

exports.delete = async function(req, res) {
  const userId = req.params.id;
  extension = req.get('Content-Type')
  image = req.body
  const userToChange = await users.searchUserBy(parseInt(userID));
  try {
    if (userToChange) {
      if (await auth.Authorized(req, res)) {
        if (userId === req.authenticatedUserId) {
            files.deleteFile(`user_${userId}`);
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
