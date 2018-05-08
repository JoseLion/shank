(function() {
  'use strict';

  angular
    .module('admin.car.brands')
    .controller('carBrandsManageController', carBrandsManageController);

  /** @ngInject */
  function carBrandsManageController($uibModalInstance, $uibModal, Notifier, car_brands_model, brands, brand) {
    var vm = this;
    vm.brands = brands;
    vm.brand = brand;
    vm.modal_title = 'Crear Marca';
    vm.button_action = 'Crear';
    
    if (brand) {
      vm.modal_title = 'Editar Marca';
      vm.button_action = 'Actualizar';
    }
    
    vm.close_modal = function() {
      $uibModalInstance.close();
    }
    
    vm.save = function() {
      if (brand) {
        car_brands_model.update(vm.brand).then(function() {
          Notifier.success({custom_messaje: 'Marca creada.'});
          $uibModalInstance.close(vm.brands);
        });
      }
      else {
        car_brands_model.create(vm.brand).then(function(response) {
          Notifier.success({custom_messaje: 'Marca actualizada.'});
          vm.brands.push(response);
          $uibModalInstance.close(vm.brands);
        });
      }
    }
  }
})();
