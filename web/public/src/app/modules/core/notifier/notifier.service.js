(function() {
  'use strict';

  angular.module('core.notifier')
  .factory('Notifier', function(error_formater, success_formater, warning_formater, toastrConfig, toastr) {
    
    function handle_success(success) {
      var success_message = success_formater.format(success);
      toastrConfig.closeButton = false;
      toastrConfig.timeOut = 3000;
      toastr.success(success_message, 'Success!');
    }
    
    function handle_warning(warning) {
      var warning_message = warning_formater.format(warning);
      toastrConfig.closeButton = false;
      toastrConfig.timeOut = 3000;
      toastr.warning(warning_message, 'Alert!');
    }
    
    function handle_error(error) {
      var error_message = error_formater.format(error);
      toastrConfig.closeButton = false;
      toastrConfig.timeOut = 3000;
      toastr.error(error_message, 'Alert!');
    }
    
    return {
      success: handle_success,
      warning: handle_warning,
      error: handle_error
    };
  });
})();