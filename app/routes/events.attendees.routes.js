const events = require('../controllers/events.attendees.controller');

module.exports = function (app) {
  app.route(app.rootUrl + '/events/:id(\\d+$)/attendees')
    .get(events.view)
    .post(events.request)
    .delete(events.remove)
  
  app.route(app.rootUrl + '/events/:id(\\d+$)/attendees/{user_id}')
    .patch(events.edit)
  }