(function() {
  'use strict';
  
  angular.module('admin.admin_users')
  .controller('adminUserController', adminUserController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.admin_users.list', {
        url: '/list',
        title: 'Lista Usuarios',
        templateUrl: 'app/modules/users/admin/views/admin.users.list.html',
        controller: 'adminUserController',
        controllerAs: 'adminUserCtrl',
        resolve: {
          users: function(admin_users_model) {
            return admin_users_model.get();
          }
        }
      });
  });
  
  function adminUserController($state, admin_users_model, users, NgTableParams, _) {
    var vm = this;    
    
    vm.users = users;
    
    parse_users();
    
    function parse_users() {
      _(vm.users).each(function(user) {
        user.state = 'Activo';
        
        if (!user.enabled) {
          user.state = 'Inactivo';
        }
      });
    }
    
    set_admin_users_pagination();
    
    function set_admin_users_pagination() {     
      vm.tableParams = new NgTableParams({
      }, {
        dataset: vm.users
      });
    }
    
    vm.edit_user = function(user) {
      $state.go('admin.admin_users.update', { _id: user._id });
    };
    
    vm.remove_user = function(user) {
      vm.close_remove_user_modal = false;
      vm.user = user;
    };
    
    vm.delete_user = function() {      
      vm.close_remove_user_modal = true;
      vm.user.enabled = !vm.user.enabled;
      
      admin_users_model.update(vm.user).then(function() {
        parse_users();
      });
    };  
  }
})();