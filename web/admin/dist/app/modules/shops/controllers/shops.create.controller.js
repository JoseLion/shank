(function() {
  'use strict';
  
  angular
  .module('admin.shops')
  .controller('shopsCreateController', shopsCreateController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.shops.create', {
        url: '/create',
        title: 'Nuevo Local/Tecnicentro',
        templateUrl: 'app/modules/shops/views/shops.create.html',
        controller: 'shopsCreateController',
        controllerAs: 'shopCtrl',
        resolve: {
          initial_data: function(shops_model, Catalog) {
            return shops_model.initial_data({code_document_type: Catalog.document_type_shop, code_file_size: Catalog.file_size, parent_code_countries: Catalog.list_countries, parent_code_shops: Catalog.local_type});
          }
        }
      });
  });
  
  function shopsCreateController($rootScope, $scope, $state, $timeout, Upload, ApiHost, initial_data, shops_model, catalogs_model, Notifier, _) {
    var vm = this;
    vm.disabled_elements = false;
    
    vm.types = initial_data.types;
    vm.countries = initial_data.countries;
    vm.file_size = initial_data.file_size;
    vm.document_type = initial_data.document_type;
    
    vm.current_location = [-0.18113519630810798,-78.48361229647765];
    vm.positions = [
      //{pos: [-0.19636,-78.482867]}
    ];
    vm.shop = {
      addresses: {
        coordinates: {}
      }
    };
    
    vm.place_marker = function() {
      var location = this.getPlace().geometry.location;
      vm.current_location = [location.lat(), location.lng()];
      vm.shop.addresses.coordinates = {latitude: location.lat(), longitude: location.lng()};
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
        return;
      }
      
      var file_extension = files[0].name.split(".").pop();
      
      if (!is_valid_file_extension(file_extension)) {
        Notifier.warning({custom_message: "Formatos soportados: JPG y PNG."});
        vm.new_shop_photo_file = null;
        return true;
      }
      
      if (!is_valid_photo(vm.file_size)) {
        Notifier.warning({custom_message: "El tamaño permitido es de "+vm.file_size.other});
        vm.new_shop_photo_file = null;
        return true;
      }        
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
    
    vm.save = function() {
      if (!is_valid_form()) {
        return;
      }
      var vm_shop = format_data_to_save();
      
      Upload.upload({
        url: ApiHost + 'shops',
        data: {
          shop: vm_shop,
          document_type: vm.document_type,
          file: vm.new_shop_photo_file
        }
      })
      .then(function () {
        Notifier.success({custom_message: 'Local/Tecnicentro ' + vm_shop.name + ' creado.'});
        $state.go('admin.shops.list');        
      },function () {        
      }, function () {
      });
    };
    
    function is_valid_form() {
      if (!vm.new_shop_photo_file) {
        Notifier.warning({custom_message: "Debe seleccionar una imagen"});
        return false;
      }
      
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