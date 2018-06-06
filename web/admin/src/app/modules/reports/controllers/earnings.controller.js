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
  
  function ReportsController(NgTableParams, earnings, math_utils, reports_model, date_utils, _) {
    var vm = this;
    vm.earnings = earnings;
    vm.search_params = {};
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
      var vm_search_params = angular.copy(vm.search_params);
      
      if (vm_search_params.from_date && vm_search_params.to_date) {
        vm_search_params.from_date = date_utils.format_date(vm_search_params.from_date);
        vm_search_params.to_date = date_utils.format_date(vm_search_params.to_date);
      }
      else {
        delete vm_search_params.from_date;
        delete vm_search_params.to_date;
      }
      
      reports_model.get_earnings(vm_search_params).then(function(response) {
        vm.earnings = response;
        parse_earnings();
        set_pagination();
      });
    }
    
    vm.get_earnings_xlsx = function() {
      var data = [];
      
      vm.earnings.map(function(earning) {
        data.push({
          User: earning.user.fullName,
          Country: earning.user.country,
          OS: earning.user.register_os,
          'Purchase date': date_utils.format_date(earning.payment_date),
          Tournament: earning.tournament.name,
          'Total amount': earning.leaderboard.total_amount
        });
      });
      
      /* generate a worksheet */
      var ws = XLSX.utils.json_to_sheet(data);
      
      /* add to workbook */
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Earnings");
      
      /* write workbook and force a download */
      XLSX.writeFile(wb, "earnings.xlsx");
    }
  }
})();