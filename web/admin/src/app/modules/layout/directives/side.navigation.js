(function() {
  'use strict';

  angular
    .module('admin.layout')
    .directive('sideNavigation', sideNavigation);

  /** @ngInject */
  function sideNavigation($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        // Call the metsiMenu plugin and plug it to sidebar navigation
        $timeout(function(){
          element.metisMenu();
        });
        
        // Colapse menu in mobile mode after click on element
        var menuElement = angular.element('#side-menu a:not([href$="\\#"])');
        menuElement.click(function(){
          if (angular.element(window).width() < 769) {
            angular.element("body").toggleClass("mini-navbar");
          }
        });
        
        // Enable initial fixed sidebar
        if (angular.element("body").hasClass('fixed-sidebar')) {
          var sidebar = element.parent();
          sidebar.slimScroll({
            height: '100%',
            railOpacity: 0.9
          });
        }
      }
    };
  }
})();
