(function() {
  'use strict';

  angular
    .module('admin.layout')
    .controller('LayoutController', LayoutController);

  /** @ngInject */
  function LayoutController($rootScope, $state, $uibModal, auth_service) {
    var vm = this;
    
    $rootScope.current_user.name = auth_service.user_name();
    $rootScope.current_user.surname = auth_service.user_surname();
    $rootScope.current_user.profile = auth_service.user_profile();
    
    vm.open_change_password_modal = function() {
      $uibModal.open({
        templateUrl: "app/modules/auth/login/views/change.password.modal.html",
        controller: 'changePasswordController',
        controllerAs: 'changePasswordCtrl'
      });
    }
    
    vm.logout = function() {
      auth_service.logout();
      $state.go("login");
    }
  }
})();
