(function() {
  'use strict';
  
  angular.module('admin.dashboard')
  .controller('adminDashboardController', adminDashboardController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.dashboard', {
        url: '/dashboard',
        title: 'Admin Dashboard',
        templateUrl: 'app/modules/dashboard/views/dashboard.html',
        controller: 'adminDashboardController',
        controllerAs: 'dashCtrl'
      });
  });
  
  function adminDashboardController($state) {
    var vm = this;
    vm.data = [];
    vm.creationDate = 1437665190507;
    
    vm.openUsers = openUsers;
    vm.openProfiles = openProfiles;
    
    function openUsers() {
      $state.go('admin.users.list');
    }
    
    function openProfiles() {
      $state.go('admin.profiles.list');
    }
  }
})();