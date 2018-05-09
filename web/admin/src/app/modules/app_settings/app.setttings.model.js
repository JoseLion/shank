(function() {
  'use strict';
  
  angular.module('admin.app.settings').factory('app_settings_model', function(base_model) {
    return base_model('profiles');
  });
})();