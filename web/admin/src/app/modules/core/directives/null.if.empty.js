(function () {
  'use strict';
  
  angular.module('core.directives')
  .directive('nullIfEmpty', function(){
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, elm, attr, ngModel) {
        ngModel.$parsers.unshift(function(value) {
          return value === '' ? null : value;
        });
        
        // TO PREVENT MEMORY LEAKS
        scope.$on('$destroy', function() {
          elm.remove();
        });
        // TO PREVENT MEMORY LEAKS
      }
    };
  });
})();