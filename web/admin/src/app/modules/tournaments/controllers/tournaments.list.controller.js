(function() {
  'use strict';
  
  angular
  .module('admin.tournaments')
  .controller('TournamentsListController', TournamentsListController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.tournaments.list', {
        url: '/list',
        title: 'Tournaments',
        templateUrl: 'app/modules/tournaments/views/tournaments.list.html',
        controller: 'TournamentsListController',
        controllerAs: 'tournamentsCtrl',
        resolve: {
          tournaments: function(tournaments_model) {
            return tournaments_model.get();
          }
        }
      });
  });
  
  function TournamentsListController($state, tournaments, tournaments_model, NgTableParams, Notifier) {
    var vm = this;
    
    vm.tournaments = tournaments;
    
    set_pagination();
    
    function set_pagination() {
      vm.tableParams = new NgTableParams({
      }, {
        dataset: vm.tournaments
      });
    }
    
    vm.edit_tournament = function(tournament) {
      $state.go('admin.tournaments.update', {_id: tournament._id});
    }
    
    vm.manage_tournament = function(tournament, action) {
      vm.close_manage_tournament_modal = false;
      vm.current_tournament = tournament;
      
      switch (action) {
        case 1:
          vm.modal_title = 'Activate tournament';
          vm.modal_body = 'Are you sure you want to activate the tournament: ' + tournament.name + '?';
          vm.modal_button_action = 'Activate';
          break;
        case 2:
          vm.modal_title = 'Desactivate tournament';
          vm.modal_body = 'Are you sure you want to desactivate the tournament: ' + tournament.name + '?';
          vm.modal_button_action = 'Desactivate';
          break;
        case 3:
          vm.modal_title = 'Delete tournament';
          vm.modal_body = 'Are you sure you want to remove the tournament: ' + tournament.name + '?';
          vm.modal_button_action = 'Remove';
          break;
      }
    }
    
    vm.update_tournament = function() {
      vm.close_manage_tournament_modal = true;
      var vm_current_tournament = angular.copy(vm.current_tournament);
      vm_current_tournament.status = !vm_current_tournament.status;
      
      tournaments_model.update(vm_current_tournament).then(function() {
        vm.current_tournament.status = !vm.current_tournament.status;
        Notifier.success({custom_message: 'Tournament updated'});
      });
    }
  }
})();