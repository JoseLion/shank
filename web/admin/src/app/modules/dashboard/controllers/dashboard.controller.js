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
        controllerAs: 'dashCtrl',
        resolve: {
          earnings: function(reports_model) {
            return reports_model.get_earnings();
          }
        }
      });
  });
  
  function adminDashboardController($state, earnings, math_utils) {
    var vm = this;
    vm.earnings = earnings;
    
    parse_earnings();
    
    function parse_earnings() {
      var total_earnings = 0;
      
      _.each(vm.earnings, function(earning) {
        earning.leaderboard.total_amount = 0;
        _.each(earning.leaderboard.checkouts, function(checkout) {
          earning.leaderboard.total_amount = math_utils.add(earning.leaderboard.total_amount, Number(checkout.payment));
        });
        
        total_earnings = math_utils.add(total_earnings, earning.leaderboard.total_amount);
      });
      
      vm.total_earnings = total_earnings;
    }
    
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