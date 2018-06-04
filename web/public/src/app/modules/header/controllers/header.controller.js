(function() {
  'use strict';

  angular
    .module('public')
    .controller('HeaderController', HeaderController);

  /** @ngInject */
  function HeaderController($rootScope, $location, $anchorScroll, $timeout) {
    var vm = this;
    
    vm.user_name = '';
    vm.user_surname ='';
    vm.current_shop = '';
    
    if (window.location.hash) {
      $timeout(function() {
        var hash = window.location.hash.substring(1);
        
        $location.hash(hash);
        $anchorScroll();
      }, 500);
    }
    
    vm.go_to_anchor = function(section) {
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash(section);
      // call $anchorScroll()
      $anchorScroll();
    }
  }
})();
