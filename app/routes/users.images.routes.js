const users = require('../controllers/users.images.controller');

module.exports = function (app) {
  app.route(app.rootUrl + '/users/:id(\\d+)/image')
    .get(users.get)
    .put(users.set)
    .delete(users.delete)
}
