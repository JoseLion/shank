'use strict';

let generate = require('../utils/permissions.utils.js').generate_permission;

module.exports = {
    general: {
        profiles_can_find: generate('find', ['all']),
        profiles_can_create: generate(['create', 'find'], ['all']),
        profiles_can_update: generate(['update', 'find'], ['all']),
        profiles_can_remove: generate(['remove', 'find'], ['all'])
    }
};
