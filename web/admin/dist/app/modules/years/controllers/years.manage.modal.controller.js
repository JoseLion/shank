(function() {
  'use strict';

  angular
    .module('admin.years')
    .controller('yearsManageController', yearsManageController);

  /** @ngInject */
  function yearsManageController($uibModalInstance, $uibModal, Notifier, years_model, years, year) {
    var vm = this;
    vm.years = years;
    vm.year = year;
    vm.modal_title = 'Crear Año';
    vm.button_action = 'Crear';
    
    if (year) {
      vm.modal_title = 'Editar Año';
      vm.button_action = 'Actualizar';
    }
    
    vm.close_modal = function() {
      $uibModalInstance.close();
    }
    
    vm.save = function() {
      if (year) {
        years_model.update(vm.year).then(function() {
          Notifier.success({custom_messaje: 'Año creada.'});
          $uibModalInstance.close(vm.years);
        });
      }
      else {
        years_model.create(vm.year).then(function(response) {
          Notifier.success({custom_messaje: 'Año actualizada.'});
          vm.years.push(response);
          $uibModalInstance.close(vm.years);
        });
      }
    }
  }
})();
