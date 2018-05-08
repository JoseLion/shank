(function() {
  'use strict';
  
  angular.module('admin.promotions')
    .controller('removeSpecificationPromotionController', removeSpecificationPromotionController);

  /** @ngInject */
  function removeSpecificationPromotionController($uibModalInstance, specification_promotion, specifications_promotion, _) {
    var vm = this;
    
    vm.specifications_promotion = specifications_promotion;
    
    vm.close_modal = function() {
      $uibModalInstance.close();
    };
    
    vm.remove = function() {
      vm.specifications_promotion = _.without(vm.specifications_promotion, specification_promotion);
      $uibModalInstance.close(vm.specifications_promotion);
    };
  }
})();