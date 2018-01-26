'use strict';

require('./profiles/profile.model');
require('./users/user.model');
require('./betting_groups/groups.model');
require('./app_settings/appSetting.model');
require('./tournaments/tournament.model');
require('./players/player.model');

module.exports = function(app) {
  app.use('/api', require('./auth/auth.routes')(app));
  app.use('/api', require('./profiles/profile.routes')(app));
  app.use('/api', require('./users/user.routes')(app));
  app.use('/api', require('./betting_groups/groups.routes')(app));
  app.use('/api', require('./app_settings/appSetting.routes')(app));
  app.use('/api', require('./tournaments/tournament.routes')(app));
  app.use('/api', require('./players/player.routes')(app));
};
