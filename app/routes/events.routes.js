const events = require('../controllers/events.controller');

module.exports = function (app) {
  app.route(app.rootUrl + '/events')
    .get(events.view)
    .post(events.add)
  
  app.route(app.rootUrl + '/events/:id(\\d+$)')
    .get(events.detailed)
    .patch(events.edit)
    .delete(events.delete)
  
  app.route(app.rootUrl + '/events/categories')
    .get(events.categories)
  
    