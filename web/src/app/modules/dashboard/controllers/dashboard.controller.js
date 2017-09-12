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
  
  function adminDashboardController($state, Notifier) {
    var vm = this;
    
    vm.data = [{id: 1, name: 'Usuario 1'}];
    
    vm.display_notifier = display_notifier;
    
    function display_notifier() {
      Notifier.success({custom_message: 'Success'});
      Notifier.warning({custom_message: 'Warning'});
      Notifier.error({custom_message: 'Error'});
    }
  }
})();