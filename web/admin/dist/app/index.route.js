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
      .state('admin.shops', {
        url: '/shops',
        abstract: true,
        title: 'Locales',
        template: '<div ui-view></div>'
      })
      .state('admin.brands', {
        url: '/brands',
        abstract: true,
        title: 'Locales',
        template: '<div ui-view></div>'
      })
      .state('admin.banners', {
        url: '/banners',
        abstract: true,
        title: 'Locales',
        template: '<div ui-view></div>'
      })
      .state('admin.advertisements', {
        url: '/advertisements',
        abstract: true,
        title: 'Locales',
        template: '<div ui-view></div>'
      })
      .state('admin.measurements', {
        url: '/measurements',
        abstract: true,
        title: 'Locales',
        template: '<div ui-view></div>'
      })
      .state('admin.promotions', {
        url: '/promotions',
        abstract: true,
        title: 'Locales',
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
