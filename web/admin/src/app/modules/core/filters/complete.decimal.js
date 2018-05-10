(function() {
  'use strict';
  
  angular.module('core.filters')
  .filter('format_number', function() {
    
    function complete_decimal(num) {
      var new_number = num;
      
      if (has_dot(num)) {
        var number_of_decimal = get_number_of_decimal(num);
        
        if (number_of_decimal == 0) {
          new_number = new_number + '00';
        }
        else if (number_of_decimal == 1) {
          new_number = new_number + '0';
        }
      }
      else {
        new_number = new_number + '.00';
      }
      
      return new_number;
    }
    
    function has_dot(num) {
      return num.indexOf('.') !== -1;
    }
    
    function get_number_of_decimal(num) {
      var decimal = num.substring((dot_position(num) + 1), length_num(num));
      
      return decimal.length;
    }
    
    function length_num(num) {
      return num.length;
    }
        
    function dot_position(num) {
      return num.indexOf('.');
    }
    
    function format_number(num) {
      
      var is_negative_number = false;
      
      if (num * 1 < 0) {
        is_negative_number = true;
        num = num.substring(1);
      }
      
      var int_part = num.substring(0, (dot_position(num)));
      var decimal_part = num.substring((dot_position(num)), length_num(num));
      
      var number_with_comma = '';
      
      var int_part_reversed = int_part.split("").reverse().join("");
      
      for (var i = 0; i < int_part_reversed.length; i++) {
        number_with_comma = number_with_comma + int_part_reversed.charAt(i);
        
        if ((i + 1) % 3 == 0 && ((i + 1) != int_part_reversed.length)) {
          number_with_comma = number_with_comma + ',';
        }
      }
      
      var number_formated = number_with_comma.split("").reverse().join("") + decimal_part;
      
      if (is_negative_number) {
        number_formated = '-' + number_formated;
      }
      
      return number_formated;
    }
    
    return function (num) {
      if (num !== null && num !== '' && angular.isDefined(num)) {
        num = String(num);
        var number_whit_decimal = complete_decimal(num);
        return format_number(number_whit_decimal);
      }
      return '0.00';
    };
  });
})();