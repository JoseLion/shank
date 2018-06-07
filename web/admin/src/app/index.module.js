(function() {
  'use strict';

  angular
    .module('shankAdmin', [
      'ngAnimate',
      'ngCookies',
      'ngTouch',
      'ngSanitize',
      'ngMessages',
      'ngAria',
      'ngResource',
      'ui.router',
      'ui.tree',
      'ui.bootstrap',
      'toastr',
      'pascalprecht.translate',
      'ngTable',
      'ngFileUpload',
      'textAngular',
      'ngMap',
      'admin'
    ])
    .directive('clockPicker', function() {
      return {
        restrict: 'A',
        link: function(scope, element) {
          element.clockpicker();
        }
      }
    });
})();
