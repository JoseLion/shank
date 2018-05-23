(function() {
  'use strict';
  
  angular.module('public.invitation').factory('acquisitions_model', function(base_model) {
    return base_model('acquisitions');
  });
})();