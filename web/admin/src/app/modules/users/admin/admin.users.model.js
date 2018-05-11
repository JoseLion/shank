(function() {
  'use strict';
  
  angular.module('admin.admin_users').factory('admin_users_model', function(base_model) {
    
    var model = base_model('admin_users');
    
    model.get_data_for_create_admin_user = function() {
      return base_model('get_data_for_create_admin_user').get();
    }
    
    model.get_data_for_update_admin_user = function(params) {
      return base_model('get_data_for_update_admin_user').get(params);
    }
    
    model.change_password = function(params) {
      return base_model('change_password_admin_user').create(params);
    }
    
    model.update_admin_user = function(params) {
      return base_model('update_admin_user').update(params);
    };
    
    return model;
  });
})();