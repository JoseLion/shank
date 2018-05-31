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
    
    $scope.$on('changeChildren', function(event, parentItem) {
      var child;
      var i;
      var len;
      var ref;
      var results;
      
      ref = parentItem.children;
      results = [];
      
      for (i = 0, len = ref.length; i < len; i++) {
        if (window.CP.shouldStopExecution(2)) {
          break;
        }
        
        child = ref[i];
        child.selected = parentItem.selected;
        
        if (child.children !== null) {
          results.push($scope.$broadcast('changeChildren', child));
        }
        else {
          results.push(void 0);
        }
      }
      
      window.CP.exitedLoop(2);
      
      return results;
    });
    
    return $scope.$on('changeParent', function(event, parentScope) {
      var children;
      
      children = parentScope.item.children;
      parentScope.item.selected = $filter('selected')(children).length === children.length;
      parentScope = parentScope.$parent.$parent;
      if (parentScope.item !== null) {
        return $scope.$broadcast('changeParent', parentScope);
      }
    });
  }
})();