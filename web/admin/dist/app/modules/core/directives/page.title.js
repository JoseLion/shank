(function () {
  'use strict';
  
  angular.module('core.directives')
  .directive('pageTitle', function($rootScope, $timeout) {
    return {
      link: function(scope, element) {
        var listener = $rootScope.$on('$stateChangeStart', function(event, toState) {
          
          var title = 'Durallanta | Admin';
          
          if (toState.title) {
            title = 'Durallanta | ' + toState.title;
          }
          
          $timeout(function() {
            element.text(title);
          });
        });
        
        $rootScope.$on('$destroy', listener);
      }
    }
  });
})();