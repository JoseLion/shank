(function() {
  'use strict';
  
  angular.module('core.filters')
  .filter('selected', function($filter) {
    return function(files) {
      return $filter('filter')(files, {
        selected: true
      });
    };
  });
})();