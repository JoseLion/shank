(function() {
  'use strict';
  
  angular
  .module('admin.tournaments')
  .controller('tournamentsCreateController', tournamentsCreateController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.tournaments.create', {
        url: '/create',
        title: 'Nuevo Tournament',
        templateUrl: 'app/modules/tournaments/views/tournaments.create.html',
        controller: 'tournamentsCreateController',
        controllerAs: 'tournamentsCtrl'
      });
  });
  
  function tournamentsCreateController($state, tournaments_model, Notifier) {
    var vm = this;
    vm.tournament = {};
    vm.years = [];
    
    var i;
    var start_year = 2016;
    
    for (i = 0; i < 20; i++) {
      vm.years.push(start_year);
      start_year++;
    }
    
    vm.get_tournaments = function() {
      if (!vm.tournament.year) {
        Notifier.warning({custom_message: 'Select a year'});
        return;
      }
      
      tournaments_model.get_tournaments_from_fantasy({year: vm.tournament.year}).then(function(data) {
        console.log(data, '-----------');
      });
    }
  }
})();