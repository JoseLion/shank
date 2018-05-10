(function() {
  'use strict';
  
  angular
  .module('admin.tournaments')
  .controller('usersCreateController', usersCreateController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.tournaments.create', {
        url: '/create',
        title: 'Nuevo Tournament',
        templateUrl: 'app/modules/users/admin/views/admin.users.create.html',
        controller: 'usersCreateController',
        controllerAs: 'adminUserCtrl',
        resolve: {
          initial_data: function(tournaments_model) {
            return tournaments_model.get_data_for_create_admin_user();
          }
        }      
      });
  });
  
  function usersCreateController($state, tournaments_model, Notifier, initial_data) {
    var vm = this;
    
    vm.profiles = initial_data.profiles;
    vm.shops = initial_data.shops;
    vm.update_password = true;
    vm.controller = 'create';
    
    vm.save = function() {
      tournaments_model.create(vm.user).then(function() {
        Notifier.success({custom_message: 'Usuario ' + vm.user.name + ' ' + vm.user.surname + ' creado.'});
        $state.go('admin.tournaments.list');
      });
    };
  }
})();