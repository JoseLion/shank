(function() {
  'use strict';
  
  angular.module('admin.measurements').factory('measurements_model', function(base_model) {
    var model = base_model('measurements');
    
    model.find_by_filters = function(params) {
      return base_model('measurements_find_by_filters').create(params);
    };
    
    model.initial_data = function(params) {
      return base_model('get_data_for_create_measurements').create(params);
    };    
    
    return model;
  });
})();