(function() {
  'use strict';

  angular
    .module('shankPublic')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
