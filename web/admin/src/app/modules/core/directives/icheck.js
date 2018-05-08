(function () {
  'use strict';
  
  angular.module('core.directives')
  .directive('icheck', function ($timeout) {
    return {
      require: 'ngModel',
      link: function ($scope, element, $attrs, ngModel) {
        return $timeout(function () {
          var value;
          value = $attrs['value'];
          
          $scope.$watch($attrs['ngModel'], function () {
            angular.element(element).iCheck('update');
          });
          
          $scope.$watch($attrs['ngDisabled'], function (newValue) {
            angular.element(element).iCheck(newValue ? 'disable' : 'enable');
            angular.element(element).iCheck('update');
          })
          
          return angular.element(element).iCheck({
            checkboxClass: 'icheckbox_square-green',
            radioClass: 'iradio_square-green'
          })
          .on('ifChanged', function (event) {
            if (angular.element(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
              $scope.$apply(function () {
                return ngModel.$setViewValue(event.target.checked);
              })
            }
          })
          .on('ifClicked', function () {
            if (angular.element(element).attr('type') === 'radio' && $attrs['ngModel']) {
              return $scope.$apply(function () {
                //set up for radio buttons to be de-selectable
                if (ngModel.$viewValue != value) {
                  return ngModel.$setViewValue(value);
                }
                else {
                  ngModel.$setViewValue(null);
                }
                ngModel.$render();
                return;
              });
            }
          });
        });
      }
    };
  });
})();