(function() {
  'use strict';

  angular
    .module('shank')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        abstract: true,
        title: 'Admin',
        templateUrl: 'app/modules/main/views/main.html',
        controller: 'MainController',
        controllerAs: 'MainCtrl'
      })

    $urlRouterProvider.otherwise('/admin/dashboard');
  }

})();
