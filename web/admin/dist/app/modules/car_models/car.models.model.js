(function() {
  'use strict';
  
  angular.module('admin.car.models').factory('car_models_model', function(base_model) {
    return base_model('car_models');
  });
})();