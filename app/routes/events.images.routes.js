const events = require('../controllers/events.images.controller');

module.exports = function (app) {
  app.route(app.rootUrl + '/events/:id(\\d+)/image')
    .get(events.view)
    .put(events.set)

}
