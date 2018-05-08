(function() {
  'use strict';
  
  angular
  .module('admin.measurements')
  .controller('measurementsCreateController', measurementsCreateController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.measurements.create', {
        url: '/create',
        title: 'Nueva Marca',
        templateUrl: 'app/modules/measurements/views/measurements.create.html',
        controller: 'measurementsCreateController',
        controllerAs: 'measurementCtrl',
        resolve: {
          initial_data: function(measurements_model, Catalog) {
            return measurements_model.initial_data({code_type_measurement_tire: Catalog.type_measurement_tire});
          }
        }         
      });
  });
  
  function measurementsCreateController($rootScope, $uibModal, Notifier, $state, initial_data, catalogs_model, measurements_model, _) {
    var vm = this;
    
    vm.car_brands = initial_data.car_brands;
    vm.models = initial_data.car_models;
    vm.years = initial_data.years;
    vm.types_measurement_tire = initial_data.types_measurement_tire;
    
    vm.specifications_modal = [];
    vm.disabled_selects = false;
    vm.measurement = {
      specifications: []
    };
    
    var specification_in;
    
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
    
    vm.open_manage_brand_modal = function() {
      var manage_brand_modal = $uibModal.open({
        templateUrl: "app/modules/car_brands/views/car.brands.manage.modal.html",
        controller: 'carBrandsManageController',
        controllerAs: 'carBrandsManageCtrl',
        backdrop: 'static',
        resolve: {
          brands: function () {
            return vm.car_brands;
          },
          brand: function() {
            return null;
          }
        }
      });
      
      manage_brand_modal.result.then(function(modal_response) {
        if (modal_response) {
          vm.car_brands = modal_response;
        }
      });
    }
    
    vm.open_manage_year_modal = function() {
      var manage_year_modal = $uibModal.open({
        templateUrl: "app/modules/years/views/years.manage.modal.html",
        controller: 'yearsManageController',
        controllerAs: 'yearsManageCtrl',
        backdrop: 'static',
        resolve: {
          years: function () {
            return vm.years;
          },
          year: function() {
            return null;
          }
        }
      });
      
      manage_year_modal.result.then(function(modal_response) {
        if (modal_response) {
          vm.years = modal_response;
        }
      });
    }
    
    vm.open_manage_model_modal = function() {
      var manage_model_modal = $uibModal.open({
        templateUrl: "app/modules/car_models/views/car.models.manage.modal.html",
        controller: 'carModelsManageController',
        controllerAs: 'carModelsManageCtrl',
        backdrop: 'static',
        resolve: {
          models: function () {
            return vm.models;
          },
          model: function() {
            return null;
          }
        }
      });
      
      manage_model_modal.result.then(function(modal_response) {
        if (modal_response) {
          vm.models = modal_response;
        }
      });
    }
    
    vm.save = function() {
      if (vm.measurement.specifications.length == 0) {
        Notifier.warning({custom_message: 'Debe Ingresar almenos una Medida'});
        return;
      }
      
      measurements_model.create(vm.measurement).then(function() {
        Notifier.success({custom_message: 'Medida creada.'});
        $state.go('admin.measurements.list');
      });
    };
  }  
})();