(function() {
  'use strict';
  
  angular.module('admin.admin_users')
  .controller('adminUserUpdateController', adminUserUpdateController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.admin_users.update', {
        url: '/update/:_id',
        title: 'Editar Usuario',
        templateUrl: 'app/modules/users/admin/views/admin.users.update.html',
        controller: 'adminUserUpdateController',
        controllerAs: 'adminUserCtrl',
        resolve: {
          initial_data: function(admin_users_model, $stateParams) {
            return admin_users_model.get_data_for_update_admin_user($stateParams._id);
          }
        }
      });
  });
  
  function adminUserUpdateController($state, initial_data, admin_users_model, Notifier) {
    var vm = this;
    
    vm.user = initial_data.user;
    vm.profiles = initial_data.profiles;
    vm.update_password = false;
    vm.controller = 'update';
    
    vm.change_password = function() {
      vm.update_password = !vm.update_password;
    }
    
    vm.update = function() {
      admin_users_model.update_admin_user(vm.user).then(function() {
        Notifier.success({custom_message: 'Usuario ' + vm.user.name + ' '+ vm.user.surname + ' Actualizado.'});
        $state.go('admin.admin_users.list');
      });
    };
  }
})();