'use strict';

require('./counters/counter.model');
require('./profiles/profile.model');
require('./users/user.model');
require('./betting_groups/groups.model');

module.exports = function(app) {
    app.use('/api', require('./auth/auth.routes')(app));
    app.use('/api', require('./profiles/profile.routes')(app));
    app.use('/api', require('./users/user.routes')(app));
    app.use('/api', require('./betting_groups/groups.routes')(app));
};
