(function() {
  'use strict';
  
  angular
  .module('admin.admin_users')
  .controller('usersCreateController', usersCreateController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.admin_users.create', {
        url: '/create',
        title: 'Nuevo Administrador',
        templateUrl: 'app/modules/users/admin/views/admin.users.create.html',
        controller: 'usersCreateController',
        controllerAs: 'adminUserCtrl',
        resolve: {
          initial_data: function(admin_users_model) {
            return admin_users_model.get_data_for_create_admin_user();
          }
        }      
      });
  });
  
  function usersCreateController($state, admin_users_model, Notifier, initial_data) {
    var vm = this;
    
    vm.profiles = initial_data.profiles;
    vm.shops = initial_data.shops;
    vm.update_password = true;
    vm.controller = 'create';
    
    vm.save = function() {
      admin_users_model.create(vm.user).then(function() {
        Notifier.success({custom_message: 'Usuario ' + vm.user.name + ' ' + vm.user.surname + ' creado.'});
        $state.go('admin.admin_users.list');
      });
    };
  }
})();