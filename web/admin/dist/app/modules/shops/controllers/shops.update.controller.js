(function() {
  'use strict';
  
  angular.module('admin.shops')
  .controller('shopUpdateController', shopUpdateController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.shops.update', {
        url: '/update/:_id',
        title: 'Editar Local/Tecnicentro',
        templateUrl: 'app/modules/shops/views/shops.update.html',
        controller: 'shopUpdateController',
        controllerAs: 'shopCtrl',
        resolve: { 
          shop: function(shops_model, $stateParams) {
            return shops_model.get($stateParams._id);
          },
          initial_data: function(shops_model, Catalog) {
            return shops_model.initial_data({code_document_type: Catalog.document_type_shop, code_file_size: Catalog.file_size, parent_code_countries: Catalog.list_countries, parent_code_shops: Catalog.local_type});
          }          
        }
      });
  });
  
  function shopUpdateController($scope, $state, $timeout, Upload, ApiHost, initial_data, shops_model, catalogs_model, Notifier, shop, _) {
    var vm = this;
    
    vm.disabled_elements = true;
    
    var is_edit_image = false;
    vm.types = initial_data.types;
    vm.document_type = initial_data.document_type;
    vm.countries = initial_data.countries;
    vm.shop = shop;
    vm.file_size = initial_data.file_size;
    vm.shop.addresses = vm.shop.addresses[0];
    
    vm.current_location = [vm.shop.addresses.coordinates.latitude, vm.shop.addresses.coordinates.longitude];
    
    var country = _.findWhere(vm.countries, {_id: vm.shop.country});
    
    if (country) {
      catalogs_model.find_by_parent_code(country.code).then(function(res_provinces) {
        vm.provinces = res_provinces;
        
          var province = _.findWhere(vm.provinces, {_id: vm.shop.province});
          catalogs_model.find_by_parent_code(province.code).then(function(res_cities) {
            vm.cities = res_cities;
          });              
      });        
    }
    
    $scope.$watch('shopCtrl.shop.addresses.coordinates.longitude', function() {
      if (Number(vm.shop.addresses.coordinates.longitude)) {
        vm.shop.addresses.coordinates.longitude = Number(vm.shop.addresses.coordinates.longitude);
        set_current_location();
      }
    });
    
    $scope.$watch('shopCtrl.shop.addresses.coordinates.longitude', function() {
      if (Number(vm.shop.addresses.coordinates.longitude)) {
        vm.shop.addresses.coordinates.longitude = Number(vm.shop.addresses.coordinates.longitude);
        set_current_location();
      }
    });
    
    function set_current_location() {
      if (vm.shop.addresses.coordinates.latitude && vm.shop.addresses.coordinates.longitude) {
        vm.current_location = [vm.shop.addresses.coordinates.latitude, vm.shop.addresses.coordinates.longitude];
      }
    }
    
    vm.place_marker = function() {
      var location = this.getPlace().geometry.location;
      vm.current_location = [location.lat(), location.lng()];
      vm.shop.addresses.coordinates = {latitude: location.lat(), longitude: location.lng()};
    }
    
    vm.get_coordinates = function(event) {
      var coordinates = event.latLng;
      vm.shop.addresses.coordinates = {latitude: coordinates.lat(), longitude: coordinates.lng()};
    }
    
    vm.get_provinces_by_country = function () {
      var country = _.findWhere(vm.countries, {_id: vm.shop.country});
      if (country) {
        catalogs_model.find_by_parent_code(country.code).then(function(res_provinces) {
          vm.provinces = res_provinces;
          vm.cities = [];
        });
      }
    };
    
    vm.get_cities_by_province = function () {
      var province = _.findWhere(vm.provinces, {_id: vm.shop.province});
      if (province) {
        catalogs_model.find_by_parent_code(province.code).then(function(res_cities) {
          vm.cities = res_cities;
        });
      }
    };
    
    //UPLOAD SHOP IMAGE    
    vm.open_upload_shop_photo = function() {
      $timeout(function() {
        angular.element('#upload_shop_photo').trigger('click');
      }, 100);
    };
    
    vm.on_change_select_photo = function(files) {
      if (angular.isUndefined(files[0])) {
        is_edit_image = false;
        return;
      }
      
      var file_extension = files[0].name.split(".").pop();
      
      if (!is_valid_file_extension(file_extension)) {
        is_edit_image = false;
        Notifier.warning({custom_message: "Formatos soportados: JPG y PNG."});
        vm.new_shop_photo_file = null;
        return true;
      }
      
      if (!is_valid_photo(vm.file_size)) {
        is_edit_image = false;
        Notifier.warning({custom_message: "El tamaño permitido es de "+vm.file_size.other});
        vm.new_shop_photo_file = null;
        return true;
      }
      is_edit_image = true;
    };
    
    function is_valid_file_extension(extension) {
      var is_valid_extension = false;
      
      switch (extension.toLowerCase()) {
        case 'jpg':
          is_valid_extension = true;
          break;
        case 'png':
          is_valid_extension = true;
          break;
      }
      
      return is_valid_extension;
    }
    
    function is_valid_photo(vm_size) {
      var file_size = vm.new_shop_photo_file.size;
      var file_size_mega_bytes = file_size / (1000 * 1000);
      var file_size_permited = parseFloat(vm_size.other);
      
      if (file_size_mega_bytes > file_size_permited ) {        
        return false;
      }
      
      return true;
    }
    
    vm.update = function() {
      
      if (!is_valid_form()) {
        return;
      }
      
      var data_up = format_data_to_save();
      var file_up = {};
      if (is_edit_image) {
        file_up = vm.new_shop_photo_file;
      }

      Upload.upload({
        url: ApiHost + 'shops_update_by_id/' + data_up._id,        
        data: {
          shop: data_up,
          document_type: vm.document_type,
          file: file_up
        }        
      })
      .then(function () {
        Notifier.success({custom_message: 'Local/Tecnicentro' + data_up.name + ' Actualizado.'});
        $state.go('admin.shops.list');        
      },function () {        
      }, function () {
      });
    };
    
    function is_valid_form() {
      
      if (_.isEmpty(vm.shop.addresses.coordinates)) {
        Notifier.warning({custom_message: "Debe seleccionar una ubicación en el mapa"});
        return false;
      }
      
      return true;
    }
    
    function format_data_to_save() {
      var vm_shop = angular.copy(vm.shop);
      vm_shop.addresses = [vm_shop.addresses];
      
      return vm_shop;
    }
  }
})();