(function() {
  'use strict';
  
  angular.module('admin.measurements')
  .controller('measurementListController', measurementListController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.measurements.list', {
        url: '/list',
        title: 'Lista de Publicidad',
        templateUrl: 'app/modules/measurements/views/measurements.list.html',
        controller: 'measurementListController',
        controllerAs: 'measurementCtrl',
        resolve: {
          measurements: function(measurements_model) {
            return measurements_model.find_by_filters({});
          },
          initial_data: function(measurements_model, Catalog) {
            return measurements_model.initial_data({code_type_measurement_tire: Catalog.type_measurement_tire});
          }
        }        
      });
  });
  
  function measurementListController($state, catalogs_model, measurements, measurements_model, initial_data) {
    var vm = this;        
    
    vm.measurements = measurements;
    vm.car_brands = initial_data.car_brands;
    vm.car_models = initial_data.car_models;
    vm.years = initial_data.years;
    vm.search_params = {};
    
    vm.find_measurements = find_measurements;
    
    vm.clear_filters = function() {
      vm.search_params = {};
      find_measurements();
    };
    
    function find_measurements() {
      measurements_model.find_by_filters(vm.search_params).then(function(res_measurements) {
       vm.measurements = res_measurements;
      });
    }
    
    vm.remove_measurement = function(measurement) {
      vm.close_remove_measurement_modal = false;
      vm.measurement = measurement;
    };
    
    vm.delete_measurement = function() {      
      vm.close_remove_measurement_modal = true;
      measurements_model.remove(vm.measurement).then(function() {
        var index = vm.measurements.indexOf(vm.measurement);
        vm.measurements.splice(index,1);    
      });              
    };     
    
    vm.edit_measurement = function(measurement) {
      $state.go('admin.measurements.update', { _id: measurement._id });
    };
  }
})();