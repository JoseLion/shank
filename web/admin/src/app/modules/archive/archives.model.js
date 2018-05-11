(function() {
  'use strict';
  
  angular.module('admin.archives').factory('archives_model', function(base_model) {
    var model = base_model('archive');
    
    model.get_file = function() {
      return base_model('get_file').get();
    }
    
    return model;
  });
})();