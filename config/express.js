const express = require('express');
const bodyParser = require('body-parser');
const { allowCrossOriginRequestsMiddleware } = require('../app/middleware/cors.middleware');
const fs = require('fs');

module.exports = function () {
    // INITIALISE EXPRESS //
    const app = express();
    app.rootUrl = '/api/v1';

    // MIDDLEWARE
    app.use(allowCrossOriginRequestsMiddleware);
    app.use(bodyParser.json());
    app.use(bodyParser.raw({ type: 'text/plain' }));  // for the /executeSql endpoint
<<<<<<< HEAD
=======
    app.use(bodyParser.raw({type: 'image/jpeg', limit: '200mb'}))
    app.use(bodyParser.raw({type: 'image/png', limit: '200mb'}))
    app.use(bodyParser.raw({type: 'image/gif', limit: '200mb'}))
>>>>>>> 57f09560401ada6db58385b1ec4823976f5c9034

    // DEBUG (you can remove these)
    app.use((req, res, next) => {
        console.log(`##### ${req.method} ${req.path} #####`);
        next();
    });

    app.get('/', function (req, res) {
        res.send({ 'message': 'Hello World!' })
    });

    // ROUTES
    const routeFiles = fs.readdirSync('app/routes');
    let i = 0;
    for (; i < routeFiles.length; i++) {
        require(`../app/routes/${routeFiles[i].substring(0, routeFiles[i].length - 3)}`)(app);
      }
    return app;
};
