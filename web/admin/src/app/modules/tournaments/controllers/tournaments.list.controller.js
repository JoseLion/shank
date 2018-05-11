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
  
  function TournamentsListController($state, tournaments, NgTableParams) {
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
  }
})();