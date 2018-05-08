(function() {
  'use strict';
  
  angular.module('admin.document_types').factory('document_types_model', function(base_model) {    
    var model = base_model('document_types');
    
    model.find_by_code = function(code) {
      return base_model('document_types_find_by_code/'+code).get();
    };
    
    return model;
  });
})();