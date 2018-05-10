(function() {
  'use strict';

  angular.module('core.notifier')
  .factory('error_formater', function($sanitize, $filter, _) {
  
    var service =  {
      format: function(error) {
        if (error.custom_message) {
          return $filter('translate')(error.custom_message);
        }
        
        var message = 'Error al';
        var action = error.action;
        var element = error.element;
        var problems = error.problems;
        
        return $sanitize(_(message) + ' ' + action + ' ' + element + ': '+ problems + '.');
      }
    };
    
    return service;
  });
})();