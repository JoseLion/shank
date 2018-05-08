(function() {
  'use strict';
  
  angular.module('admin.promotions').factory('promotions_model', function(base_model) {    
  
    var model = base_model('promotions');
    
    model.initial_data = function(params) {
      return base_model('get_data_for_create_promotions').create(params);
    };
    
    return model;    
    
  });
})();