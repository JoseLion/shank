(function() {
  'use strict';
  
  angular
  .module('admin.tournament.settings')
  .controller('tournamentSettingsController', tournamentSettingsController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.tournament.settings', {
        url: '/settings',
        title: 'Tournament Settings',
        templateUrl: 'app/modules/tournament_settings/views/tournament.settings.html',
        controller: 'tournamentSettingsController',
        controllerAs: 'tournamentSettingsCtrl',
        resolve: {
          app_settings: function(app_settings_model) {
            return app_settings_model.get();
          }
        }
      });
  });
  
  function tournamentSettingsController($state, app_settings_model, app_settings, Notifier, _) {
    var vm = this;
    console.log(app_settings, 'app_settings');
    vm.app_settings = app_settings;
    vm.rounds = [{id: 0}, {id: 1}, {id: 2}, {id: 3}];
    var round_in;
    
    vm.add_round = function() {
      vm.rounds.push({id: ''});
      reorganize_rounds();
    }
    
    vm.remove_round = function(round) {
      round_in = _.findWhere(vm.rounds, {id: round.id});
      if (round_in) {
        vm.rounds = _.without(vm.rounds, round_in);
        reorganize_rounds();
      }
    }
    
    function reorganize_rounds() {
      _.each(vm.rounds, function(round, index) {
        round.id = index;
      });
    }
    
    vm.save_tournament_settings = function() {
      
    }
  }
})();