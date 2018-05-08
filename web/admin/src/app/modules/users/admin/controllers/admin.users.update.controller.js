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
  
  function adminUserUpdateController($scope, $state, initial_data, admin_users_model, store_users_model, Notifier, _) {
    var vm = this;
    
    vm.user = initial_data.user;
    vm.profiles = initial_data.profiles;
    vm.shops = initial_data.shops;
    vm.update_password = false;
    vm.change_password = false;
    vm.controller = 'update';
    
    $scope.$watch('adminUserCtrl.user.profile', function() {
      vm.display_extra_fields = false;
      
      var commercial_user = _(vm.profiles).findWhere({_id: vm.user.profile});
      if (commercial_user && commercial_user.role == 2) {
        vm.display_extra_fields = true;
        vm.user.role = 2;
      }
      else {
        vm.user.role = 1;
        vm.user.shop = null;
      }
    });
    
    vm.change_password = function() {
      vm.update_password = !vm.update_password;
    }
    
    vm.update = function() {
      var current_model = vm.display_extra_fields? store_users_model : admin_users_model;
      
      current_model.update_admin_user(vm.user).then(function() {
        Notifier.success({custom_message: 'Usuario ' + vm.user.name + ' '+ vm.user.surname + ' Actualizado.'});
        $state.go('admin.admin_users.list');
      });
    };    

  }
})();