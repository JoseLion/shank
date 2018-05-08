(function() {
  'use strict';
  
  angular.module('admin.measurements')
    .controller('specificationsManageController', specificationsManageController);

  /** @ngInject */
  function specificationsManageController($uibModalInstance, specification, specifications, types_measurement_tire, _) {
    var vm = this;
    
    vm.specifications = angular.copy(specifications);

    if (specification) {
      vm.specification = _.findWhere(vm.specifications, {tmp_id: specification.tmp_id});
    }
    
    removed_types_measurement_tire();
    
    function removed_types_measurement_tire() {
      vm.types_measurement_tire = [];
      
      var type_measurement_tire_in;
      
      _.each(types_measurement_tire, function(type_measurement_tire) {
        type_measurement_tire_in = _.find(vm.specifications, function(specification_in) {
          return specification_in.type == type_measurement_tire._id;
        });
        
        if (!type_measurement_tire_in) {
          vm.types_measurement_tire.push(type_measurement_tire);
        }
        else {
          // if (specification && type_measurement_tire._id == specification.type) {
            vm.types_measurement_tire.push(type_measurement_tire);
          // }
        }
      });
    }
    
    vm.close_modal = function() {
      $uibModalInstance.close();
    };
    
    vm.add_specification=function() {
      if (!specification) {
        vm.specifications.push(vm.specification);
      }
      
      $uibModalInstance.close(vm.specifications);
    };
  }
})();
