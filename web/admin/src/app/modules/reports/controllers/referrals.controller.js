(function() {
  'use strict';
  
  angular
  .module('admin.reports')
  .controller('ReferralsController', ReferralsController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.reports.referrals', {
        url: '/referrals',
        title: 'Referrals',
        templateUrl: 'app/modules/reports/views/referrals.html',
        controller: 'ReferralsController',
        controllerAs: 'referralCtrl',
        resolve: {
          referrals: function(reports_model) {
            return reports_model.get_referrals();
          }
        }
      });
  });
  
  function ReferralsController($scope, $filter, referrals, _) {
    var vm = this;
    $scope.list = referrals;
    
    vm.search_params = {};
    vm.dates = {
      from_date_opened: false,
      to_date_opened: false
    };
    
    parse_referrals();
    
    function parse_referrals() {
      _.each($scope.list, function(referral, index) {
        if (index === 0) {
          referral.opened = false;
          referral.level = 1;
        }
        _.each(referral.guests, function(guests) {
          guests.level = 2;
        });
      });
    }
    
    vm.clear_search_params = function() {
      vm.search_params = {};
    }
    
    vm.open_search_calendar = function(number) {
      console.log("-----------------");
      switch (number) {
        case 1:
          vm.dates.from_date_opened = true;
          vm.dates.to_date_opened = false;
          break;
        case 2:
          vm.dates.from_date_opened = false;
          vm.dates.to_date_opened = true;
          break;
      }
    }
    
    //https://codepen.io/sliiice/pen/GurpF
  }
})();