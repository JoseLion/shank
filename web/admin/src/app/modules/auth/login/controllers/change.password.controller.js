(function() {
  'use strict';

  angular
    .module('login')
    .controller('changePasswordController', changePasswordController);

  /** @ngInject */
  function changePasswordController($uibModalInstance, admin_users_model, Notifier) {
    
    var vm = this;
    
    vm.close_modal = function() {
      $uibModalInstance.close();
    }
    
    vm.save = function() {
      admin_users_model.change_password(vm.credential).then(function() {
        Notifier.success({custom_message: 'Clave actualizada.'});
        $uibModalInstance.close();
      });
    }
  }
})();
