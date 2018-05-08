(function() {
  'use strict';
  
  angular.module('admin.measurements')
    .controller('removeSpecificationController', removeSpecificationController);

  /** @ngInject */
  function removeSpecificationController($uibModalInstance, specification, specifications, _) {
    var vm = this;
    
    vm.specifications = specifications;
    
    vm.close_modal = function() {
      $uibModalInstance.close();
    };
    
    vm.remove = function() {
      vm.specifications = _.without(vm.specifications, specification);
      $uibModalInstance.close(vm.specifications);
    };
  }
})();