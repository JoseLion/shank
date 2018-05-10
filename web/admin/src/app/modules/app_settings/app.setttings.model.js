(function() {
  'use strict';
  
  angular.module('admin.app.settings').factory('app_settings_model', function(base_model) {
    var model = base_model('app_settings');
    
    model.get_app_settings = function(params) {
      return base_model('get_app_settings').create(params);
    }
    
    model.save_web_link = function(params) {
      return base_model('save_web_link').create(params);
    }
    
    return model;
  });
})();