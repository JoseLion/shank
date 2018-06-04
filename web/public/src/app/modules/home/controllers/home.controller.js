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
    
    vm.creationDate = 1526418254625;
  }
})();