(function() {
  'use strict';

  angular.module('admin', [
    'core',
    'auth',
    'admin.layout',
    'admin.dashboard',
    'admin.admin_users',
    'admin.profiles',
    'admin.permissions'
  ]);
})();