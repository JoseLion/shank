(function() {
  'use strict';
  
  angular
  .module('public')
  .controller('HomeController', HomeController)
  .config(function($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        title: 'Home',
        templateUrl: 'app/modules/home/views/home.html',
        controller: 'HomeController',
        controllerAs: 'homeCtrl'
      });
  });
  
  function HomeController() {
    var vm = this;
    
    vm.players = [
      {id: 1, position: 1, player: 'Tiger Woods', total: -3, thru: 17, today: -3, points: '8,000'},
      {id: 2, position: 'T2', player: 'Phil Mickelson', total: -1, thru: 17, today: -2, points: '7,300'},
      {id: 3, position: 'T2', player: 'Jordan Spieth', total: -1, thru: 18, today: -2, points: '7,300'},
      {id: 4, position: 'T2', player: 'Emiliano Grillo', total: -1, thru: 18, today: 'E', points: '7,300'},
      {id: 5, position: 5, player: 'Patrick Rodgers', total: 'E', thru: 18, today: '+1', points: '5,550'}
    ];
  }
})();