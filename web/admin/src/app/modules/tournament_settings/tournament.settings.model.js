(function() {
  'use strict';
  
  angular.module('admin.tournament.settings').factory('tournament_settings_model', function(base_model) {
    var model = base_model('tournament_settings');
    
    model.get_tournament_settings = function() {
      return base_model('get_tournament_settings').get();
    }
    
    model.save_tournament_settings = function(params) {
      return base_model('save_tournament_settings').create(params);
    }
    
    return model;
  });
})();