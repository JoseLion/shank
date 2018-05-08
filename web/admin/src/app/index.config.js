(function() {
  'use strict';

  angular
    .module('durallantaAdmin')
    .config(config);

  /** @ngInject */
  function config($logProvider, $httpProvider, $translateProvider, toastrConfig) {
    // Enable log
    $logProvider.debugEnabled(true);
    
    //Error server Interceptor
    $httpProvider.interceptors.push('error_request_interceptor');

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = false;
    toastrConfig.progressBar = true;
    
    //translate
    $translateProvider.useStaticFilesLoader({
      prefix : 'app/i18n/',
      suffix : '.json'
    });
    
    $translateProvider.preferredLanguage('es_EC');
  }

})();
