(function() {
  'use strict';
  
  angular.module('admin.catalogs').factory('catalogs_model', function(base_model) {
    var model = base_model('catalogs');
    
    model.find_by_parent_code = function(code) {
      return base_model('catalogs_find_by_parent_code/'+code).get();
    };
    
    model.find_by_code = function(code) {
      return base_model('catalogs_find_by_code/'+code).get();
    };      
    
    return model;
  });
})();