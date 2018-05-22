(function() {
  'use strict';
  
  angular
  .module('admin.reports')
  .controller('ReportsController', ReportsController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.reports.earnings', {
        url: '/earnings',
        title: 'Earnings',
        templateUrl: 'app/modules/reports/views/earnings.html',
        controller: 'ReportsController',
        controllerAs: 'reportEarningCtrl',
        resolve: {
          earnings: function(reports_model) {
            return reports_model.get_earnings();
          }
        }
      });
  });
  
  function ReportsController(NgTableParams, earnings, math_utils, reports_model, _) {
    var vm = this;
    vm.earnings = earnings;
    vm.dates = {
      from_date_opened: false,
      to_date_opened: false
    };
    
    parse_earnings();
    
    function parse_earnings() {
      _.each(vm.earnings, function(earning) {
        earning.leaderboard.total_amount = 0;
        _.each(earning.leaderboard.checkouts, function(checkout) {
          earning.leaderboard.total_amount = math_utils.add(earning.leaderboard.total_amount, Number(checkout.payment));
        });
      });
    }
    
    set_pagination();
    
    function set_pagination() {
      vm.tableParams = new NgTableParams({
      }, {
        dataset: vm.earnings
      });
    }
    
    vm.clear_search_params = function() {
      vm.search_params = {};
    }
    
    vm.open_search_calendar = function(number) {
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
    
    vm.find_earnings = function() {
      vm_search_params = angular.copy(vm.search_params);
    }
    
    vm.get_earnings_xlsx = function() {
      reports_model.get_earnings_xlsx().then(function(response) {
        var file = new Blob([response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        var fileURL = URL.createObjectURL(file);
        
        var anchor = document.createElement("a");
        anchor.download = "earnings.xls";
        anchor.href = fileURL;
        document.body.appendChild(anchor);
        anchor.click();
      });
    }
  }
})();