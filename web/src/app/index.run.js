(function() {
  'use strict';

  angular
    .module('shank')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
