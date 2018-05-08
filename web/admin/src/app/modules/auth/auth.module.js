(function() {
  'use strict';
  
  angular.module('auth', [
    'login',
    'auth.services',
    'Session'
  ]);
})();