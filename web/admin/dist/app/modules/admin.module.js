(function() {
  'use strict';

  angular.module('admin', [
    'core',
    'auth',
    'admin.layout',
    'admin.dashboard',
    'admin.admin_users',
    'admin.store_users',
    'admin.profiles',
    'admin.permissions',
    'admin.shops',
    'admin.catalogs',
    'admin.brands',
    'admin.banners',
    'admin.advertisements',
    'admin.measurements',
    'admin.document_types',
    'admin.documents_base',
    'admin.promotions',
    'admin.car.brands',
    'admin.car.models',
    'admin.years'
  ]);
})();