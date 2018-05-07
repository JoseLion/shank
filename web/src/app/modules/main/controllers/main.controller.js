(function() {
  'use strict';

  angular
    .module('admin.main')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($rootScope, $state) {
    var vm = this;
    console.log($state, 'state');
    $rootScope.current_user = {
      name: 'John',
      surname: 'Doe',
      profile: 'Administrador'
    }
    
    vm.logout = function() {
    }
  }
})();
