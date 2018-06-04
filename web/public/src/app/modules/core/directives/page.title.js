(function () {
  'use strict';
  
  angular.module('core.directives')
  .directive('pageTitle', function($rootScope, $timeout) {
    return {
      link: function(scope, element) {
        var listener = function(event, toState, toParams, fromState) {
          
          var title = '';
          
          if (toState.title) {
            title = toState.title;
          }
          
          $rootScope.state_name = toState.name;
          
          $timeout(function() {
            element.text(title);
          });
        };
        $rootScope.$on('$stateChangeStart', listener);
      }
    }
  });
})();