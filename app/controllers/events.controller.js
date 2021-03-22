const events = require('../models/events.model')

exports.view = async function(req, res) {
  return null;
};

exports.add = async function(req, res) {
  return null;
};

exports.detailed = async function(req, res) {
  const id = req.params.id;
  try {
    const result = await events.model.getDetails(id);
    if (result.length === 0) {
      res.status(404)
        .send('Not Found')
    } else {
      ers.status(200)
        .send(result);
      }
    } catch(err) {
      
      res.status(500)
        .send(`Internal Server Error`)
    
  return null;
};

exports.edit = async function(req, res) {
  return null;
};

exports.delete = async function(req, res) {
  return null;
};

exports.categories = async function(res, res) {
  return null;
};