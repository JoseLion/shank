(function() {
  'use strict';
  
  angular.module('admin.tournament.settings').factory('tournament_settings_model', function(base_model) {
    var model = base_model('tournament_settings');
    
    return model;
  });
})();