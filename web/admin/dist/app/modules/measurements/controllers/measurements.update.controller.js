(function() {
  'use strict';
  
  angular.module('admin.measurements')
  .controller('measurementUpdateController', measurementUpdateController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.measurements.update', {
        url: '/update/:_id',
        title: 'Editar Medida',
        templateUrl: 'app/modules/measurements/views/measurements.update.html',
        controller: 'measurementUpdateController',
        controllerAs: 'measurementCtrl',
        resolve: {
          measurement: function(measurements_model, $stateParams) {
            return measurements_model.get($stateParams._id);
          },
          initial_data: function(measurements_model, Catalog) {
            return measurements_model.initial_data({code_car_brand: Catalog.car_brand, code_type_measurement_tire: Catalog.type_measurement_tire});
          }          
        }
      });
  });
  
  function measurementUpdateController($state, $uibModal, measurements_model, catalogs_model, Notifier, measurement, initial_data, _ ) {
    var vm = this;
    
    vm.measurement = measurement;
    vm.car_brands = initial_data.car_brands;
    vm.models = initial_data.car_models;
    vm.years = initial_data.years;
    vm.types_measurement_tire = initial_data.types_measurement_tire;
    vm.disabled_selects = true;
    
    var specification_in;
    
    parse_measurement_specifications();
    
    vm.open_specifications_modal = function(specification) {
      var specification_manage_modal = $uibModal.open({
        templateUrl: "app/modules/measurements/views/specifications.manage.modal.html",
        controller: 'specificationsManageController',
        controllerAs: 'specificationsManageCtrl',
        backdrop: 'static',
        resolve: {
          specification: function () {
            return specification;
          },
          specifications: function() {
            return vm.measurement.specifications;
          },
          types_measurement_tire: function() {
            return vm.types_measurement_tire;
          }
        }
      });
      
      specification_manage_modal.result.then(function(modal_response) {
        if (modal_response) {
          vm.measurement.specifications = modal_response;
          parse_measurement_specifications();
        }
      });
    };
    
    function parse_measurement_specifications() {
      _.each(vm.measurement.specifications, function(specification, index) {
        specification.tmp_id = index;
        specification.type_name = '';
        specification_in = _.findWhere(vm.types_measurement_tire, {_id: specification.type});
        
        if (specification_in) {
          specification.type_name = specification_in.name;
        }
      });
    }
    
    vm.open_remove_specifications_modal = function(specification) {
      var remove_specification_modal = $uibModal.open({
        templateUrl: "app/modules/measurements/views/specifications.remove.modal.html",
        controller: 'removeSpecificationController',
        controllerAs: 'removeSpecificationCtrl',
        backdrop: 'static',
        resolve: {
          specification: function () {
            return specification;
          },
          specifications: function() {
            return vm.measurement.specifications;
          }
        }
      });
      
      remove_specification_modal.result.then(function(modal_response) {
        if (modal_response) {
          vm.measurement.specifications = modal_response;
        }
      });
    };
    
    vm.update = function() {
      
      if (vm.measurement.specifications.length == 0) {
        Notifier.warning({custom_message: 'Debe Ingresar almenos una Medida'});
        return;
      }
      
      measurements_model.update(vm.measurement).then(function() {
        Notifier.success({custom_message: 'Medida Actualizada.'});
        $state.go('admin.measurements.list');
      });
    };
  }
})();