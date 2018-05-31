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
  
  function ReferralsController(NgTableParams, referrals, reports_model, date_utils, _) {
    var vm = this;
    
    vm.referrals = referrals;
    vm.tree1 = [{
      level: 0,
      name: 'A PIE',
      type: 1,
      nodes: []
    }];
    
    vm.remove = function(scope) {
      scope.remove();
    };
    
    vm.toggle = function(scope) {
      scope.toggle();
    };
    
    vm.newSubItem = function(scope) {
      var node_data = scope.$modelValue;
      
      node_data.nodes.push({
        //id: node_data.id * 10 + node_data.nodes.length,
        //name: node_data.name + '.' + (node_data.nodes.length + 1),
        level: Number(node_data.level) + 1,
        name: '',
        nodes: []
      });
    };
  }
})();