(function() {
  'use strict';
  
  angular.module('core.underscore', [])
  .factory('_', function($window) {
    //http://stackoverflow.com/questions/14968297/use-underscore-inside-angular-controllers
    return $window._; // assumes underscore has already been loaded on the page
  });
})();
