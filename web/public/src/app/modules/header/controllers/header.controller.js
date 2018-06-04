(function() {
  'use strict';

  angular
    .module('public')
    .controller('HeaderController', HeaderController);

  /** @ngInject */
  function HeaderController($rootScope, $location, $anchorScroll, $timeout, public_services, auth_service, session) {
    var vm = this;
    
    vm.user_name = '';
    vm.user_surname ='';
    vm.current_shop = '';
    
    vm.is_authenticated =  auth_service.is_authenticated();
    if (vm.is_authenticated) {
      var _session = session.recover();
      
      vm.user_name = _session.name;
      vm.user_surname = _session.surname;
      
      if (_session.shop) {
        vm.current_shop = _session.shop.name;
      }
    }
    
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

    vm.open_whatsapp = function(index) {
      public_services.open_whatsapp($rootScope.durallantaoutlet_phones[index]);
    }
    
    vm.logout = function() {
      auth_service.logout();
      vm.is_authenticated =  false;
      $rootScope.is_authenticated = false;
    };
  }
})();
