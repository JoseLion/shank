(function() {
  'use strict';
  
  angular.module('admin.reports').factory('reports_model', function(base_model) {
    var model = base_model('reports');
    
    model.get_earnings = function(params) {
      return base_model('get_earnings').create(params);
    }
    
    return model;
  });
})();