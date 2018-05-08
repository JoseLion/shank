(function() {
  'use strict';
  
  angular.module('admin.advertisements').factory('advertisements_model', function(base_model) {    
    var model = base_model('advertisements');
    
    model.advertisements_created = function() {
      return base_model('advertisements_created/').get();
    };

    model.initial_data = function(params) {
      return base_model('get_data_for_create_advertisement').create(params);
    };
    
    return model;
  });
})();