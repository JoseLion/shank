(function () {
  'use strict';

  angular.module('core.notifier')
  .factory('success_formater', function($sanitize) {
  
    var service =  {
      format: function(success) {
        
        if(success.custom_message) {
          return success.custom_message;
        }
        
        var action = success.action;
        var element = success.element;
        
        return $sanitize(_(element) + ' ' + success.identifier + ' ' + action + '.');
      }
    };
    
    return service;
  });
})();