(function() {
  'use strict';
  
  angular.module('admin.brands')
  .controller('brandListController', brandListController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.brands.list', {
        url: '/list',
        title: 'Lista de Marcas',
        templateUrl: 'app/modules/brands/views/brands.list.html',
        controller: 'brandListController',
        controllerAs: 'brandCtrl',
        resolve: {
          brands: function(brands_model) {
            return brands_model.get();
          }
        }
      });
  });
  
  function brandListController($state, brands_model, brands, NgTableParams, _) {
    var vm = this;    
    
    vm.brands = brands;
    
    parse_brands() ;
    
    //for crud
    vm.remove_brand = function(brand) {
      vm.close_remove_brand_modal = false;
      vm.brand = brand;
    };
    
    vm.delete_brand = function() {      
      vm.close_remove_brand_modal = true;
      vm.brand.enabled = !vm.brand.enabled;
      brands_model.update(vm.brand);
      parse_brands();
    };     
    
    vm.edit_brand = function(brand) {
      $state.go('admin.brands.update', { _id: brand._id });
    };
    
    //pagination    
    set_brands_pagination();
    
    function parse_brands() {
      _(vm.brands).each(function(brand) {
        brand.state = 'Activo';
        
        if (!brand.enabled) {
          brand.state = 'Inactivo';
        }
      });
    }    
    
    function set_brands_pagination() {
      vm.brandsTableParams = new NgTableParams({
      }, {        
        dataset: vm.brands
      });      
    }
    
  }
})();