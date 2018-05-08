(function () {
  'use strict';
  
  angular.module('core.utils')
  .factory('validator_utils', function(_) {
  
    function validate_luhn(id_number) {
      var even = false;
      var sum = 0;
      
      _.each(id_number.split('').reverse(), function(digit) {
        digit = parseInt(digit, 10);
        if (even) {
          digit = digit * 2;
        }
    
        sum += _.reduce(digit.toString().split(''), function(total, digit) {
          digit = parseInt(digit, 10);
          return total + digit;
        }, 0);
        even = !even;
      });
    
      if((sum % 10 === 0) && (sum !== 0)){
        return true;
      }
    
      return false;
    }
    
    function is_id_card(value) {
      
      var province = parseInt(value.substring(0, 2), 10);
      var invalid_province = province < 1 || province > 24;
  
      var third_digit = parseInt(value.substring(2, 3), 10);
      var invalid_third_digit = third_digit > 5;
  
      var invalid_length = value.length !== 10;
  
      var has_non_digit_character = /[^0-9]/.test(value);
  
      var invalid_luhn_verification = !validate_luhn(value);
      
      if (invalid_province ||
          invalid_third_digit ||
          invalid_length ||
          has_non_digit_character ||
          invalid_luhn_verification) {
        return false;
      }
      return true;
    }
    
    function is_legal_ruc(value) {
      
      var third_digit = parseInt(value.substring(2, 3), 10);
      var last_three_numbers = value.substring(10, 13);
      
      var invalid_length = value.length !== 13;
      var invalid_third_digit = (third_digit != 6 && third_digit != 9);
      var invalid_last_three_numbers = last_three_numbers != '001'
      
      if (invalid_length ||
          invalid_third_digit ||
          invalid_last_three_numbers) {
        return false;
      }
      return true;
    }
    
    function is_valid_password(value) {
      
      // at least one number, one lowercase and one uppercase letter
      // at least six characters that are letters, numbers or the underscore
      var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
      return re.test(value);
    }
    
    return {
      is_id_card: function(value) {
        return is_id_card(value);
      },
      is_legal_ruc: function(value) {
        return is_legal_ruc(value);
      },
      is_valid_password: function(value) {
        return is_valid_password(value);
      }
    };
  });
})();