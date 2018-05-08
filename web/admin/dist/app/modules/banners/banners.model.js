(function() {
  'use strict';
  
  angular.module('admin.banners').factory('banners_model', function(base_model) {
    var model = base_model('banners');
    
    model.initial_data = function(params) {
      return base_model('get_data_for_create_banner').create(params);
    };    
    
    return model;
  });
})();