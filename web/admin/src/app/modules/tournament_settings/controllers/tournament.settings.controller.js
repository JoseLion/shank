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
          tournament_settings: function(tournament_settings_model) {
            return tournament_settings_model.get_tournament_settings();
          }
        }
      });
  });
  
  function tournamentSettingsController($state, tournament_settings_model, tournament_settings, Notifier, _) {
    var vm = this;
    console.log(tournament_settings, 'tournament_settings');
    
    var round_in;
    
    if (_.isEmpty(tournament_settings.points)) {
      vm.points = {code: 'PTS', name: 'Puntos', values: [{}, {}, {}, {}, {}]};
    }
    else {
      format_data_to_display(tournament_settings);
    }
    
    if (_.isEmpty(tournament_settings.fines_percentage)) {
      vm.fines_percentage = {code: 'FND', name: 'Porcentaje de multa', values: []};
    }
    
    function format_data_to_display(_tournament_settings) {
      vm.points = angular.copy(_tournament_settings.points);
      vm.points.values = [];
      
      _.each(_tournament_settings.points.values, function(point) {
        vm.points.values.push({value: point});
      });
      
      vm.fines_percentage = angular.copy(_tournament_settings.fines_percentage);
      vm.fines_percentage.values = [];
      
      _.each(_tournament_settings.fines_percentage.values, function(round, index) {
        vm.fines_percentage.values.push({id: index, value: round});
      });
    }
    
    vm.add_round = function() {
      vm.fines_percentage.values.push({id: ''});
      reorganize_rounds();
    }
    
    vm.remove_round = function(round) {
      round_in = _.findWhere(vm.fines_percentage.values, {id: round.id});
      if (round_in) {
        vm.fines_percentage.values = _.without(vm.fines_percentage.values, round_in);
        reorganize_rounds();
      }
    }
    
    function reorganize_rounds() {
      _.each(vm.fines_percentage.values, function(round, index) {
        round.id = index;
      });
    }
    
    vm.save = function() {
      if (!is_valid_fines_percentage()) {
        return;
      }
      
      tournament_settings_model.save_tournament_settings(prepare_data()).then(function(res_data) {
        Notifier.success({custom_message: 'Confiuración actualizada'});
        format_data_to_display(res_data);
      });
    }
    
    function is_valid_fines_percentage() {
      if (vm.fines_percentage.values.length < 3) {
        Notifier.warning({custom_message: 'Ingrese por lomenos 4 porcentajes de multa.'});
        return false;
      }
      
      return true;
    }
    
    function prepare_data() {
      var vm_points = angular.copy(vm.points);
      var vm_fines_percentage = angular.copy(vm.fines_percentage);
      
      vm_points.values = [];
      vm_fines_percentage.values = [];
      
      _.each(vm.points.values, function(point) {
        vm_points.values.push(point.value);
      });
      
      _.each(vm.fines_percentage.values, function(round) {
        vm_fines_percentage.values.push(round.value);
      });
      
      return {
        points: vm_points,
        fines_percentage: vm_fines_percentage
      };
    }
  }
})();