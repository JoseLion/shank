(function() {
  'use strict';
  
  angular.module('admin.years').factory('years_model', function(base_model) {
    return base_model('years');
  });
})();