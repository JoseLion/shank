(function() {
  'use strict';
  
  angular.module('admin.shops')
  .controller('shopListController', shopListController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.shops.list', {
        url: '/list',
        title: 'Lista Locales y Tecnicentros',
        templateUrl: 'app/modules/shops/views/shops.list.html',
        controller: 'shopListController',
        controllerAs: 'shopCtrl',
        resolve: {
          shops: function(shops_model) {
            return shops_model.get();
          }
        }
      });
  });
  
  function shopListController($state, shops_model, shops, NgTableParams, _) {
    var vm = this;    
    
    vm.shops = shops;
    
    parse_shops();
    
    function parse_shops() {
      _(vm.shops).each(function(shop) {
        shop.state = shop.enabled ? 'Activo' : 'Inactivo';
        shop.addresses = shop.addresses[0];
      });
    }
    
    set_shops_pagination();
    
    function set_shops_pagination() {
      vm.shopsTableParams = new NgTableParams({
      }, {
        dataset: vm.shops
      });
    }
    
    //for crud
    vm.remove_shop = function(shop) {
      vm.close_remove_shop_modal = false;
      vm.shop = shop;
    };
    
    vm.delete_shop = function() {      
      vm.close_remove_shop_modal = true;
      vm.shop.enabled = !vm.shop.enabled;
      shops_model.update(vm.shop);
      parse_shops();
    };     

    vm.edit_shop = function(shop) {
      $state.go('admin.shops.update', { _id: shop._id });
    };
  }
})();