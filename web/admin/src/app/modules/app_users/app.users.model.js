(function() {
  'use strict';
  
  angular.module('admin.app.users').factory('app_users_model', function(base_model) {
    return base_model('app_users');
  });
})();