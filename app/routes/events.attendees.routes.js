const attendees = require('../controllers/events.attendees.controller');

module.exports = function (app) {
  app.route(app.rootUrl + '/events/:id(\\d+)/attendees')
    .get(attendees.view)
    .post(attendees.request)
    .delete(attendees.remove)

  app.route(app.rootUrl + '/events/:id(\\d+)/attendees/:user_id(\\d+)')
    .patch(attendees.edit)
  }
