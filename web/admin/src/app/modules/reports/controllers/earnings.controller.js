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
  
  function ReportsController(NgTableParams, earnings) {
    var vm = this;
    vm.earnings = earnings;
    
    set_pagination();
    
    function set_pagination() {
      vm.tableParams = new NgTableParams({
      }, {
        dataset: vm.earnings
      });
    }
  }
})();