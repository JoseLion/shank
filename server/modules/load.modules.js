'use strict';

require('./users/users.model');

module.exports = function(app) {
  app.use('/api', require('./auth/auth.routes')(app));
  app.use('/api', require('./users/users.routes')(app));
};