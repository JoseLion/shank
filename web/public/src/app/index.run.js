(function() {
  'use strict';

  angular
    .module('shankPublic')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, $state, $window) {

    $log.debug('runBlock end');
    
    $rootScope.$on("$stateChangeSuccess", function (event, currentRoute, previousRoute) {
      $window.scrollTo(0, 0);
    });
    
    $rootScope.state = $state;
  }

})();
