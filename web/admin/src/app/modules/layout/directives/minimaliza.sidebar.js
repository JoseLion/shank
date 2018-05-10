(function() {
  'use strict';
  
  angular
    .module('admin.layout')
    .directive('minimalizaSidebar', minimalizaSidebar);
    
    function minimalizaSidebar($timeout) {
      return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: function ($scope) {
          
          $scope.minimalize = function () {
            
            angular.element("body").toggleClass("mini-navbar");
            
            if (!angular.element('body').hasClass('mini-navbar') || angular.element('body').hasClass('body-small')) {
              // Hide menu in order to smoothly turn on when maximize menu
              angular.element('#side-menu').hide();
              // For smoothly turn on menu
              $timeout(function () {
                angular.element('#side-menu').fadeIn(400);
              }, 200);
              
            }
            else if (angular.element('body').hasClass('fixed-sidebar')) {
              angular.element('#side-menu').hide();
              
              $timeout(function () {
                angular.element('#side-menu').fadeIn(400);
              }, 100);
            }
            else {
              // Remove all inline style from jquery fadeIn function to reset menu state
              angular.element('#side-menu').removeAttr('style');
            }
          };
        }
      };
    }

})();