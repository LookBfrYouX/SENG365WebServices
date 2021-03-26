const attendees = require('../models/events.attendees.model.js')

exports.view = async function(req, res) {
  try {
    if (req.params.id) {
      
    } else {
      res.statusMessage = 'Bad Request';
      res.status(400)
         .send();
    }
  }
};

exports.request = async function(req, res) {
  return null;
};

exports.remove = async function(req, res) {
  return null;
};

exports.edit = async function(req, res) {
  return null;
};
