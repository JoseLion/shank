(function() {
  'use strict';
  
  angular.module('Session', [
    'ngStorage'
  ])
  .run(function($sessionStorage, session) {
  
    if (angular.isDefined($sessionStorage.session)) {
      session.store($sessionStorage.session);
    }
  
  });
})();