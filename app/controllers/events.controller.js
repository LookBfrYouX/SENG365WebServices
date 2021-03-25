const events = require('../models/events.model')
const auth = require('../middleware/authorize.middleware')

exports.view = async function(req, res) {
  return null;
  };

exports.add = async function(req, res) {
  try {
    if (auth.Authorized(req, res)) {
      query = req.body.title + ' ' + req.body.description + ' ';
      query += (req.body.date && ) ? 'date = ' + req.body.date + ', ' : ''
      query += (req.body.url) ?  'url = ' + req.body.url + ', ' : ''
      query += (req.body.venue) ?  'venue = ' + req.body.venue + ', ' : ''
      query += (req.body.capacity) ?  'capacity = ' + req.body.capacity + ', ' : ''
    } else {

    }
  } catch {

  }
  };

exports.detailed = async function(req, res) {
  const id = req.params.id;
  try {
    const result = (await events.getDetails(parseInt(id)))[0];
    console.log(result)
    if (!result) {
      res.statusMessage = 'Not Found'
      res.status(404)
        .send()
    } else {
      res.statusMessage = 'OK'
      res.status(200)
        .json(result);
      }
    } catch(err) {
      console.log(err);
      res.statusMessage = 'Internal Server Error'
      res.status(500)
        .send()

  return null;
  };
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
