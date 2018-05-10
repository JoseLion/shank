(function() {
  
  'use strict';
  
  angular.module('admin.profiles')
  .factory('profile_services', function(_) {
    
    var module_with_permissions = function(permissions) {
      var modules = [];
      var module_with_permissions;
      
      _(permissions).each(function(permission, key) {
        module_with_permissions = {name: key, permissions: []};
        
        _(permission.general).each(function(general) {
          module_with_permissions.permissions.push({action: general});
        });
        
        modules.push(module_with_permissions);
      });
      
      return modules;
    }
    
    return {
      format_module_with_permissions: module_with_permissions
    };
  });
})();