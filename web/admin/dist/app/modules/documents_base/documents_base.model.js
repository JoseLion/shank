(function() {
  'use strict';
  
  angular.module('admin.documents_base').factory('documents_base_model', function(base_model) {    
    var model = base_model('documents_base');
    
    //model.find_by_code = function(code) {
    //  return base_model('documents_types_find_by_code/'+code).get();
    //};
    
    return model;
  });
})();