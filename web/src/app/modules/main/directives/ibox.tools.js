(function() {
  'use strict';

  angular
    .module('admin.main')
    .directive('iboxTools', iboxTools);

  /** @ngInject */
  function iboxTools($timeout) {
    return {
      restrict: 'A',
      scope: true,
      templateUrl: 'app/modules/main/views/ibox.tools.full.screen.html',
      controller: function ($scope, $element) {
        // Function for collapse ibox
        $scope.showhide = function () {
          var ibox = $element.closest('div.ibox');
          var icon = $element.find('i:first');
          var content = ibox.children('.ibox-content');
          content.slideToggle(200);
          // Toggle icon from up to down
          icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
          ibox.toggleClass('').toggleClass('border-bottom');
          $timeout(function () {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
          }, 50);
        };
        // Function for close ibox
        $scope.closebox = function () {
          var ibox = $element.closest('div.ibox');
          ibox.remove();
        };
        // Function for full screen
        $scope.fullscreen = function () {
          var ibox = $element.closest('div.ibox');
          var button = $element.find('i.fa-expand');
          $('body').toggleClass('fullscreen-ibox-mode');
          button.toggleClass('fa-expand').toggleClass('fa-compress');
          ibox.toggleClass('fullscreen');
          setTimeout(function() {
              $(window).trigger('resize');
          }, 100);
        };
      }
    };
  }
})();
