'use strict';

let generate = require('../utils/permissions.utils.js').generate_permission;

module.exports = {
    general: {
        counters_can_find: generate('find', ['all']),
        counters_can_create: generate(['create', 'find'], ['all']),
        counters_can_update: generate(['update', 'find'], ['all']),
        counters_can_remove: generate(['remove', 'find'], ['all'])
    }
};
