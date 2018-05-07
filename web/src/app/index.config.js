(function() {
  'use strict';

  angular
    .module('shank')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, $httpProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = false;
    toastrConfig.progressBar = true;
    
    //Error server Interceptor
    $httpProvider.defaults.withCredentials = true; //Request Cookies
    $httpProvider.interceptors.push('error_request_interceptor');
    
    //Activate WOW.js plugin for animation on scrol
    new WOW().init();
  }

})();
