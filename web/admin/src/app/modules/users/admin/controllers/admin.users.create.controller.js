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
  
  function usersCreateController($scope, $state, admin_users_model, store_users_model, Notifier, initial_data, _) {
    var vm = this;
    
    vm.profiles = initial_data.profiles;
    vm.shops = initial_data.shops;
    vm.update_password = true;
    vm.controller = 'create';
    
    $scope.$watch('adminUserCtrl.user.profile', function() {
      vm.display_extra_fields = false;
      
      if (vm.user && vm.user.profile) {
        var commercial_user = _(vm.profiles).findWhere({_id: vm.user.profile});
        if (commercial_user && commercial_user.role == 2) {
          vm.display_extra_fields = true;
        }
      }
    });
    
    vm.save = function() {
      var current_model = vm.display_extra_fields? store_users_model : admin_users_model;
      
      current_model.create(vm.user).then(function() {
        Notifier.success({custom_message: 'Usuario ' + vm.user.name + ' ' + vm.user.surname + ' creado.'});
        $state.go('admin.admin_users.list');
      });
    };
  }  
})();