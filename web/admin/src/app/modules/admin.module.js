(function() {
  'use strict';

  angular.module('admin', [
    'core',
    'auth',
    'admin.layout',
    'admin.dashboard',
    'admin.archives',
    'admin.admin_users',
    'admin.profiles',
    'admin.permissions',
    'admin.tournament.settings',
    'admin.app.settings',
    'admin.app.users',
    'admin.tournaments',
    'admin.reports',
    'public.invitation'
  ]);
})();