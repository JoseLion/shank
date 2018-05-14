'use strict';

var generate = require('../utils/permissions.utils.js').generate_permission;

module.exports = {
  general: {
    tournaments_can_find: generate('find', [ 'all' ]),
    tournaments_can_create: generate([ 'create', 'find' ], [ 'all' ]),
    tournaments_can_update: generate([ 'update', 'find' ], [ 'all' ]),
    tournaments_can_remove: generate([ 'remove', 'find' ], [ 'all' ])
  }
};