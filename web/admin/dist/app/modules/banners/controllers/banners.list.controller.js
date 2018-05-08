(function() {
  'use strict';
  
  angular.module('admin.banners')
  .controller('bannerListController', bannerListController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.banners.list', {
        url: '/list',
        title: 'Lista de Banners',
        templateUrl: 'app/modules/banners/views/banners.list.html',
        controller: 'bannerListController',
        controllerAs: 'bannerCtrl',
        resolve: {
          banners: function(banners_model) {
            return banners_model.get();
          }
        }
      });
  });
  
  function bannerListController($state, banners_model, banners, NgTableParams) {
    var vm = this;    
    
    vm.banners = banners;
    
    //for crud
    vm.remove_banner = function(banner) {
      vm.close_remove_banner_modal = false;
      vm.banner = banner;
    };
    
    vm.delete_banner = function() {      
      vm.close_remove_banner_modal = true;
      banners_model.remove(vm.banner).then(function() {
        var index = vm.banners.indexOf(vm.banner);
        vm.banners.splice(index,1);    
        set_banners_pagination();
      });            
    };     
    
    vm.edit_banner = function(banner) {
      $state.go('admin.banners.update', { _id: banner._id });
    };
    
    //pagination    
    set_banners_pagination();
    
    function set_banners_pagination() {
      vm.bannersTableParams = new NgTableParams({
      }, {        
        dataset: vm.banners
      });      
    }
    
  }
})();