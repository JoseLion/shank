(function () {
  'use strict';
  
  angular.module('core.directives')
  .directive('password', function(validator_utils, $parse) {
  
    return {
      restrict: 'A',
      require: 'ngModel',
      priority: 0,
      link: function(scope, element, attrs, input_model) {
        
        scope.$watch('$parent.' + attrs.confirmPassword, function() {
          validate_password();
        });
        
        scope.$watch(attrs.ngModel, function(new_value, old_value) {
          if (new_value !== old_value) {
            validate_password();
          }
        });
        
        function validate_password() {
          var error_key = 'invalid_password';
          var is_valid = true;
          
          var error_key_confirm_password = 'invalid_confirm_password';
          var is_valid_confirm_password = true;
          var password;
  
          input_model.$setValidity(error_key, is_valid);
          input_model.$setValidity(error_key_confirm_password, is_valid_confirm_password);
          
          var value = element.val();

          if (/\S/.test(value)) {
            is_valid = validator_utils.is_valid_password(value);
            input_model.$setValidity(error_key, is_valid);
          }
          
          if (scope.$eval('$parent.' + attrs.confirmPassword)) {
            
            if (value && is_valid) {
              password =  $parse(attrs.confirmPassword)(scope);
              
              if (password !== value) {
                is_valid_confirm_password = false;
              }
              else {
                is_valid_confirm_password = true;
              }
              input_model.$setValidity(error_key_confirm_password, is_valid_confirm_password);
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