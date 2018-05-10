(function() {
  'use strict';
  
  angular
  .module('admin.tournament.settings')
  .controller('TournamentsController', TournamentsController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.tournaments.list', {
        url: '/list',
        title: 'Tournaments',
        templateUrl: 'app/modules/tournaments/views/tournaments.html',
        controller: 'TournamentsController',
        controllerAs: 'tournamentsCtrl',
        resolve: {
          tournament_settings: function(tournament_settings_model) {
            return tournament_settings_model.get_tournament_settings();
          }
        }
      });
  });
  
  function TournamentsController() {
    var vm = this;
  }
})();