users = require('../models/users.model')
password = require ('../helpers/passwords')
auth = require ('../helpers/auth')

exports.register = async function(req, res) {
  const user = req.body;
  try {
    const emailCheck = await user.model.checkEmailExists(user.email);
    if (emailCheck === false) {
      userId = await user.model.addUser(user);
      res.status(201)
        .send('Created')
        .json(userId);

    } else {
      res.status(400)
        .send('Bad Request');
      }
    } catch(err) {

      res.status(500)
        .send(`Internal Server Error`);
  }
};

exports.login = async function(req, res) {
  const emailReq = req.body.email;
  const passwordReq = req.body.password;
  const hashedPass = password.hash(passwordReq);
  try {
    if (req.head.auth_token === null) {
      const user = await user.model.searchUserBy(`email = ${emailReq}`)
      if (password.compareHash(user.password, hashedPass)) {
        token = auth.generateAuth()
        users.model.setAuthToken(token, emailReq)
        res.status(200)
           .send('OK')
           .json({userId:user.userId, token:`${token}`});
      }
    }

  } catch {

  };

  };

exports.logout = async function(req, res) {
  return null;
  };

exports.view = async function(req, res) {
  return null;
  };

exports.edit = async function(req, res) {
  return null;
  };
