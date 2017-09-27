'use strict';

let Q = require('q');
let _ = require('lodash');

let generate_permission = function(actions, paths, permission) {
  paths = paths || [];

  if(!_(actions).isArray()) {
    actions = [ actions ];
  }

  let generated_permission = function(user, data, action) {
    if(!_(generated_permission.actions).contains(action)) {
      return Q.reject();
    }

    return Q.fapply(generated_permission.permission, [user, data, action]);
  };

  generated_permission.actions = actions;

  add_paths(generated_permission, paths, actions);

  generated_permission.permission = permission || function(user, data, action) {
    if(action === 'remove') {
      return [ 'all' ];
    }

    return generated_permission[action];
  };
  
  generated_permission.add_paths = add_paths_to_existing_permission(generated_permission);

  return generated_permission;
};

module.exports = {
  generate_permission: generate_permission
};

function add_paths_to_existing_permission(current_permission) {
  return function(actions, paths) {
    if(!_(actions).isArray()) {
      actions = [ actions ];
    }

    current_permission.actions = _(current_permission.actions).union(actions);
    current_permission.paths = _(current_permission.paths).union(paths);

    _(actions).each(function(action) {
      current_permission[action] = _(current_permission[action]).union(paths);
    });

    return current_permission;
  };
}

function add_paths(permission, paths, actions) {
  permission.paths = paths;
  permission.find = [];
  permission.create = [];
  permission.update = [];
  permission.remove = [];


  _(actions).each(function(action) {
    permission[action] = paths;
  });

  if(permission.remove.length > 0) {
    permission.remove = [ true ];
  }
}