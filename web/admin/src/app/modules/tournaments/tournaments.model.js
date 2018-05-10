(function() {
  'use strict';
  
  angular.module('admin.tournaments').factory('tournaments_model', function(base_model) {
    
    var model = base_model('tournaments');
    
    return model;
  });
})();