(function() {
  'use strict';

  angular
    .module('login')
    .controller('LoginController', LoginController)
    .config(function($stateProvider) {
      $stateProvider
        .state('login', {
          url: '/login',
          title: 'Inicio de Sesion',
          templateUrl: 'app/modules/auth/login/views/login.html',
          controller: 'LoginController',
          controllerAs: 'LoginCtrl'
        });
    });

  /** @ngInject */
  function LoginController($state, auth_service) {
    var vm = this;
    
    vm.credentials = {};
    
    vm.login = function() {
      
      auth_service.admin_login(vm.credentials).then(function() {
        $state.go('admin.dashboard');
      }, function() {
      });
    }
  }
})();
