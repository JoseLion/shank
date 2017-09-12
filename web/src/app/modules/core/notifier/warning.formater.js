(function () {
  'use strict';
  
  angular.module('core.notifier')
  .factory('warning_formater', function() {
  
    var service =  {
      format: function(warning) {
        
        if(warning.custom_message) {
          return warning.custom_message;
        }
        
        var action = warning.action;
        var element = warning.element;
        var message = warning.message;
        
        return action + ' ' + element + ' ' + message + '.';
      }
    };
    
    return service;
  });
})();