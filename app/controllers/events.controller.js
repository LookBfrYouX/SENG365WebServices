const events = require('../models/events.model')
const auth = require('../middleware/authorize.middleware')

exports.view = async function(req, res) {
  return null;
  };

exports.add = async function(req, res) {
  try {
    var currentDate = new Date().toLocaleTimeString();
    if (auth.Authorized(req, res)) {
      dbCategories = await events.getCategories()
      for (category in req.body.categoryIds) {
        if (!dbCategories.includes(category) || !req.body.title || !req.body.description) {
          res.statusMessage = 'Bad Request';
          res.status(400)
             .send()
        }
      }
      var query = 'title, description, categoryIds, ';
      var values = `'${req.body.title}', '${req.body.description}', categoryIds`;
      if (query += (req.body.date && new Date(req.body.date) > currentDate) ? 'date, ' : '') {
        values += `${req.body.date}, `
      }
      if (query += (req.body.url) ?  'url, ' : '') {
        values += `'${req.body.url}', `
      }

      if (query += (req.body.venue) ?  'venue, ' : '') {
        values += `'${req.body.venue}', `
      }

      if (query += (req.body.capacity) ?  'capacity, ' : '') {
        values += `${req.body.capacity}, `
      }

      query += (req.body.capacity) ?  'capacity = ' + req.body.capacity + ', ' : '';
      query = query.slice(0,-2);
      values = values.slice(0,-2);
      await events.addEvent(query, values, req.authenticatedUserId);
      res.statusMessage = 'OK'
      res.status(200)
        .json(result);

    } else {
      res.statusMessage = 'Unauthorized';
      res.status(401)
         .send()
    }
  } catch {
    console.log(err);
    res.statusMessage = 'Internal Server Error'
    res.status(500)
      .send()
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
