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
        controllerAs: 'reportEarningCtrl'
      });
  });
  
  function ReportsController(NgTableParams) {
    var vm = this;
    vm.users = [];
    
    set_pagination();
    
    function set_pagination() {
      vm.tableParams = new NgTableParams({
      }, {
        dataset: vm.users
      });
    }
  }
})();