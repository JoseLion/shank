(function() {
  'use strict';
  
  angular.module('admin.profiles').factory('profiles_model', function(base_model) {
    var model = base_model('profiles');
    
    model.get_admin_profiles = function() {
      return base_model('admin_profiles').get();
    }
    
    model.get_store_profiles = function() {
      return base_model('store_profiles').get();
    }
    
    return model;
  });
})();