(function() {
  'use strict';

  angular
    .module('durallantaAdmin')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        abstract: true,        
        title: 'Admin',
        templateUrl: 'app/modules/layout/views/layout.html',
        controller: 'LayoutController',
        controllerAs: 'layoutCtrl'
      })
      .state('admin.admin_users', {
        url: '/admin_users',
        abstract: true,
        title: 'Usuarios',
        template: '<div ui-view></div>'
      })
      .state('admin.profiles', {
        url: '/profiles',
        abstract: true,
        title: 'Perfiles',
        template: '<div ui-view></div>'
      })
      .state('admin.tournament', {
        url: '/tournament',
        abstract: true,
        title: 'Tournament',
        template: '<div ui-view></div>'
      })
      .state('home', {
        url: '/home',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      });

    $urlRouterProvider.otherwise('/admin/dashboard');
  }

})();