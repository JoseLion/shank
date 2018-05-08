(function() {
  'use strict';
  
  angular.module('core.directives')
  .directive('completeDecimal', function() {
    
    return {
      restrict: 'A',
      require: 'ngModel',
      priority: 0,
      link: function(scope, elem) {
        var element = angular.element(elem);
        var current_value;
        
        element.on('blur', function() {
          
          current_value = element.val();
          
          if (is_empty()) {
            element.val('0.00');
          }
          
          if (has_dot()) {
            check_decimals();
          }
          
          if (!is_empty() && !has_dot()) {
            element.val(current_value + '.00');
          }
        });
        
        function is_empty() {
          if (current_value === '') {
            return true;
          }
          return false;
        }
        
        function has_dot() {
          return current_value.indexOf('.') !== -1;
        }
        
        function dot_position() {
          return current_value.indexOf('.');
        }
        
        function length_current_value() {
          return current_value.length;
        }
        
        function check_decimals() {
          if ((length_current_value() - dot_position()) == 1) {
            element.val(current_value + '00');
          }
          
          if ((length_current_value() - dot_position()) == 2) {
            element.val(current_value + '0');
          }
        }
      }
    };
  });
})();