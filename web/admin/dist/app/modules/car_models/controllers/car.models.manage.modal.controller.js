(function() {
  'use strict';

  angular
    .module('admin.car.models')
    .controller('carModelsManageController', carModelsManageController);

  /** @ngInject */
  function carModelsManageController($uibModalInstance, $uibModal, Notifier, car_models_model, models, model) {
    var vm = this;
    vm.models = models;
    vm.model = model;
    vm.modal_title = 'Crear Modelo';
    vm.button_action = 'Crear';
    
    if (model) {
      vm.modal_title = 'Editar Modelo';
      vm.button_action = 'Actualizar';
    }
    
    vm.close_modal = function() {
      $uibModalInstance.close();
    }
    
    vm.save = function() {
      if (model) {
        car_models_model.update(vm.model).then(function() {
          Notifier.success({custom_messaje: 'Modelo creada.'});
          $uibModalInstance.close(vm.models);
        });
      }
      else {
        car_models_model.create(vm.model).then(function(response) {
          Notifier.success({custom_messaje: 'Modelo actualizado.'});
          vm.models.push(response);
          $uibModalInstance.close(vm.models);
        });
      }
    }
  }
})();
