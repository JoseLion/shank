(function() {
  'use strict';

  angular
    .module('shankPublic')
    .config(config);

  /** @ngInject */
  function config($logProvider, $locationProvider, toastrConfig) {
    // Enable log
    $logProvider.debugEnabled(true);
    
    // Enable pushState with html5Mode
    // http://www.codelord.net/2015/05/12/angularjs-how-to-setup-pushstate-with-html5mode/
    $locationProvider.html5Mode(true).hashPrefix('!');

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;
    
    // Activate WOW.js plugin for animation on scrol
    new WOW().init();
  }

})();
