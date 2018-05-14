(function() {
  'use strict';
  
  angular.module('admin.tournaments').factory('tournaments_model', function(base_model) {
    
    var model = base_model('tournaments');
    
    model.get_tournaments_from_fantasy = function(params) {
      return base_model('get_tournaments_from_fantasy').create(params);
    }
    
    model.create_tournament = function(params) {
      return base_model('create_tournament').multipart(params);
    }
    
    return model;
  });
})();