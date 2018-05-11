(function() {
  
  'use strict';
  
  angular.module('core.services').factory('permissions_management', function(_) {
    return {
      build_permissions: function(modules, permissions) {
        var custom_permissions = {permission_names: []};
        //var keys_modules = Object.keys(modules);
        var permission_names = [];
        var action;
        
        _.each(modules, function(module) {
          
          permission_names = [];
          
          _.each(permissions, function(permission) {
            
            if (module.id === permission.moduleId) {
              permission_names.push(permission.action);
            }
          });
          
          var module_permissions = {
            find: [],
            create: [],
            update: [],
            remove: [],
            permission_names: permission_names
          };
          
          _.each(permission_names, function(permission_name) {
            
            custom_permissions.permission_names.push(permission_name);
            action = permission_name.split('_')[1];
            
            switch(action) {
              case 'find':
                module_permissions.find.push('all');
                break;
              case 'create':
                module_permissions.create.push('all');
                break;
              case 'update':
                module_permissions.update.push('all');
                break;
              case 'delete':
                module_permissions.remove.push('all');
                break;
            }
          });
          
          custom_permissions[module.name] = module_permissions;
        });
        
        return custom_permissions;
      }
    };
  });
})();