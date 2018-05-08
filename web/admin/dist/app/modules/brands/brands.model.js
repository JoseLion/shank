(function() {
  'use strict';
  
  angular.module('admin.brands').factory('brands_model', function(base_model) {    
    var model = base_model('brands');
    
    model.brands_catalog = function() {
      return base_model('brands_catalog/').get();
    };
    
    model.initial_data = function(params) {
      return base_model('get_data_for_create_brand').create(params);
    };
    
    return model;
  });
})();