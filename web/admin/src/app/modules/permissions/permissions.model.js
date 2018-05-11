(function() {
  'use strict';
  
  angular.module('admin.permissions').factory('permissions_model', function(base_model) {
    
    return base_model('permissions');
  });
})();