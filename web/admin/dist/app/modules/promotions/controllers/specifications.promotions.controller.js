(function() {
  'use strict';
  
  angular.module('admin.promotions')
    .controller('SpecificationsPromotionsController', SpecificationsPromotionsController);

  /** @ngInject */
  function SpecificationsPromotionsController($uibModalInstance, specification_promotion) {
    var vm = this;

    vm.specification_promotion = {};
    

    if (specification_promotion){
      vm.specification_promotion = angular.copy(specification_promotion);
    }    
    
    vm.close_modal = function() {
      $uibModalInstance.close();
    };
    
    vm.add_specification=function(){
      $uibModalInstance.close(vm.specification_promotion);
    };
  }
})();