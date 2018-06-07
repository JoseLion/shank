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
          },
          funnel: function(reports_model) {
            return reports_model.get_funnel();
          },
          data_for_dashboard: function(reports_model) {
            return reports_model.get_data_for_dashboard();
          }
        }
      });
  });
  
  function adminDashboardController($state, earnings, funnel, data_for_dashboard, math_utils, _) {
    var vm = this;
    vm.earnings = earnings;
    vm.funnel = funnel;
    vm.data_for_dashboard = data_for_dashboard;
    parse_data_for_dashboard();
    
    function parse_data_for_dashboard() {
      vm.data_for_dashboard.avg_people_on_tournament = 0;
      vm.data_for_dashboard.avg_earnings_per_group = 0;
      
      if (Number(vm.data_for_dashboard.total_tournaments_in_groups) > 0) {
        vm.data_for_dashboard.avg_people_on_tournament = math_utils.round(math_utils.divide(Number(vm.data_for_dashboard.total_users_in_tournaments), Number(vm.data_for_dashboard.total_tournaments_in_groups)));
      }
      
      if (Number(vm.data_for_dashboard.total_groups) > 0) {
        vm.data_for_dashboard.avg_earnings_per_group = math_utils.round(math_utils.divide(Number(vm.data_for_dashboard.total_earnings), Number(vm.data_for_dashboard.total_groups)));
      }
    }
    
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