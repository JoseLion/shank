(function() {
  'use strict';
  
  angular.module('admin.reports').factory('reports_model', function(base_model) {
    var model = base_model('reports');
    
    model.get_earnings = function() {
      return base_model('get_earnings').get();
    }
    
    return model;
  });
})();