(function () {
  'use strict';
  
  angular.module('core.directives')
  .directive('pageTitle', function($rootScope, $timeout) {
    return {
      link: function(scope, element) {
        var listener = function(event, toState, toParams, fromState, fromParams) {
          
          var title = 'Portafolio | Admin';
          
          if (toState.title) {
            title = 'Portafolio | ' + toState.title;
          }
          
          $timeout(function() {
            element.text(title);
          });
        };
        $rootScope.$on('$stateChangeStart', listener);
      }
    }
  });
})();