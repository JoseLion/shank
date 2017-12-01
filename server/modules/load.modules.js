'use strict';

require('./counters/counter.model');
require('./users/users.model');
require('./betting_groups/groups.model');
require('./profiles/profile.model');

module.exports = function(app) {
    app.use('/api', require('./auth/auth.routes')(app));
    app.use('/api', require('./users/users.routes')(app));
    app.use('/api', require('./betting_groups/groups.routes')(app));
    app.use('/api', require('./profiles/profile.routes')(app));
};
