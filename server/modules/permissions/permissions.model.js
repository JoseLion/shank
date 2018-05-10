'use strict';

var Q = require('q');
var fs = require('fs');
var _ = require('underscore');

var blacklisted_modules = [
  'auth',
  'core',
  'load.modules.js',
  'services',
  'sockets',
  'utils',
  'catalogs'
];

var modules = fs.readdirSync(__dirname + '/../');

var permissions = {};
var required_permissions = [];
var all_permissions = {};

_(modules).forEach((module) => {
  if(_(blacklisted_modules).contains(module)) {
    return;
  }
  
  var module_path = __dirname + '/../' + module;
  
  var files = fs.readdirSync(module_path);
  
  _(files).each((file) => {
    if(!file.match(/.*_{0,1}permissions.js/)) {
      return;
    }
    
    var permissions_categories = _(require(module_path + '/' + file));
    var module_name = module;
    
    if (file.match(/.+_permissions.js/)) {
      module_name = file.replace(/_permissions.js/, '');
    }
    
    permissions[module_name] = {};
    
    all_permissions[module_name] = {};
    
    _(permissions_categories).each((category_permissions, category_name) => {
      
      if(category_name === 'required') {
        required_permissions = required_permissions.concat(_(category_permissions).keys());
        all_permissions[module_name][category_name] = category_permissions;
        return;
      }
      
      all_permissions[module_name][category_name] = category_permissions;
      permissions[module_name][category_name] = category_permissions;
    });
  });
});

var permissions_names = {};

_(permissions).each(function(module, module_name) {
  var category_permissions = {};
  _(module).each(function(category, category_name) {
    category_permissions[category_name] = _(category).keys();
  });

  permissions_names[module_name] = category_permissions;
});

module.exports = {
  find: function() {
    return Q(permissions_names);
  },
  find_paths: function(searched_permissions) {
    var paths_for_permissions = {};
    _(all_permissions).each(function(module, module_name) {
      _(module).each(function(category) {
        _(category).each(function(permission, permission_name) {

          if(!paths_for_permissions[module_name]) {
            paths_for_permissions[module_name] = {
              find: [],
              create: [],
              update: [],
              remove: [],
              permission_names:[],
            };
          }

          if(!_(searched_permissions).contains(permission_name)) {
            return;
          }

          paths_for_permissions[module_name].permission_names.push(permission_name);

          paths_for_permissions[module_name].find = _(paths_for_permissions[module_name].find).union(permission.find);
          paths_for_permissions[module_name].create = _(paths_for_permissions[module_name].create).union(permission.create);
          paths_for_permissions[module_name].update = _(paths_for_permissions[module_name].update).union(permission.update);
          paths_for_permissions[module_name].remove = _(paths_for_permissions[module_name].remove).union(permission.remove);
        });
      });
    });

    return Q(paths_for_permissions);
  },
  permissions: permissions_names,
  required_permissions: required_permissions
};