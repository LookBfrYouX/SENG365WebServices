users = require('../models/users.model')

exports.register = async function(req, res) {
  const user = req.body
  try {
    const emailCheck = await user.model.checkEmailExists(user.email);
    if (emailCheck === false) {
      await user.model.addUser(user)
      res.status(201)
        .send('Created')

    } else {
      res.status(400)
        .send('Bad Request')
      }
    } catch(err) {

      res.status(500)
        .send(`Internal Server Error`)
  }
};

exports.login = async function(req, res) {
  return null;
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
