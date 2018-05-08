(function() {
  'use strict';
  
  angular.module('admin.store_users').factory('store_users_model', function(base_model) {
    var model = base_model('store_users');
    
    model.get_data_for_update_store_user = function(params) {
      return base_model('get_data_for_update_store_user').get(params);
    }
    
    model.get_data_for_create_store_user = function() {
      return base_model('get_data_for_create_store_user').get();
    }
    
    model.update_admin_user = function(params) {
      return base_model('update_store_user').update(params);
    };
    
    return model;
  });
})();