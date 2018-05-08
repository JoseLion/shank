(function () {
  'use strict';
  
  angular.module('core.directives')
  .directive('idCard', function(validator_utils) {
  
    return {
      restrict: 'A',
      require: 'ngModel',
      priority: 0,
      link: function(scope, element, attrs, input_model) {
  
        scope.$watch('$parent.' + attrs.isIdentityCard, function() {
          validate_id_card();
        });
  
        scope.$watch(attrs.ngModel, function(new_value, old_value) {
          if (new_value !== old_value) {
            validate_id_card();
          }
        });
  
        function validate_id_card() {
          var error_key = 'invalid_id_card';
          var is_valid = true;
  
          input_model.$setValidity(error_key, is_valid);
  
          if (scope.$eval('$parent.' + attrs.isIdentityCard)) {
            var value = element.val();
  
            if (/\S/.test(value)) {
              is_valid = validator_utils.is_id_card(value);
              input_model.$setValidity(error_key, is_valid);
            }
          }
  
          if (!scope.$$phase) {
            scope.$digest();
          }
        }
      }
    };
  });
})();