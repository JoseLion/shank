(function() {
  'use strict';
  
  angular.module('admin.car.brands').factory('car_brands_model', function(base_model) {
    return base_model('car_brands');
  });
})();