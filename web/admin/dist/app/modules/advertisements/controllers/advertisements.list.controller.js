(function() {
  'use strict';
  
  angular.module('admin.advertisements')
  .controller('advertisementListController', advertisementListController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.advertisements.list', {
        url: '/list',
        title: 'Lista de Publicidad',
        templateUrl: 'app/modules/advertisements/views/advertisements.list.html',
        controller: 'advertisementListController',
        controllerAs: 'advertisementCtrl',
        resolve: {
          advertisements: function(advertisements_model) {
            return advertisements_model.get();
          }
        }
      });
  });
  
  function advertisementListController($state, advertisements_model, advertisements, NgTableParams) {
    var vm = this;    
    
    vm.advertisements = advertisements;
    
    //for crud
    vm.remove_advertisement = function(advertisement) {
      vm.close_remove_advertisement_modal = false;
      vm.advertisement = advertisement;
    };
    
    vm.delete_advertisement = function() {      
      vm.close_remove_advertisement_modal = true;
      
      advertisements_model.remove(vm.advertisement).then(function() {
        var index = vm.advertisements.indexOf(vm.advertisement);
        vm.advertisements.splice(index,1);    
        set_advertisements_pagination();
      });              
    };     
    
    vm.edit_advertisement = function(advertisement) {
      $state.go('admin.advertisements.update', { _id: advertisement._id });
    };
    
    //pagination    
    set_advertisements_pagination();
    
    function set_advertisements_pagination() {
      vm.advertisementsTableParams = new NgTableParams({
      }, {        
        dataset: vm.advertisements
      });      
    }
    
  }
})();