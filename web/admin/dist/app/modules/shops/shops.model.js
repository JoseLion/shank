(function() {
  'use strict';
  
  angular.module('admin.shops').factory('shops_model', function(base_model) {
    var model = base_model('shops');

    model.initial_data = function(params) {
      return base_model('get_data_for_create_shop').create(params);
    };
    
    return model;
  });
})();