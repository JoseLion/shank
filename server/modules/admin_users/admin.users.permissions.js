'use strict';

var generate = require('../utils/permissions.utils.js').generate_permission;

module.exports = {
  general: {
    users_admin_can_find: generate('find', [ 'all' ]),
    users_admin_can_create: generate([ 'create', 'find' ], [ 'all' ]),
    users_admin_can_update: generate([ 'update', 'find' ], [ 'all' ]),
    users_admin_can_remove: generate([ 'remove', 'find' ], [ 'all' ])
  }
};