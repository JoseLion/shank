(function() {
  'use strict';
  
  angular
  .module('admin.brands')
  .controller('brandsCreateController', brandsCreateController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.brands.create', {
        url: '/create',
        title: 'Nueva Marca',
        templateUrl: 'app/modules/brands/views/brands.create.html',
        controller: 'brandsCreateController',
        controllerAs: 'brandCtrl',
        resolve: {
          initial_data: function(brands_model, Catalog) {
            return brands_model.initial_data({code_document_type: Catalog.document_type_brand, code_file_size: Catalog.file_size});
          }          
        }        
      });
  });
  
  function brandsCreateController($rootScope, Upload, ApiHost, $state, $timeout, brands_model, Notifier, initial_data) {
    var vm = this;
    
    vm.file_size = initial_data.file_size;
    vm.document_type = initial_data.document_type;
    
    vm.save = function() {
      if (!vm.new_brand_photo_file) {
        Notifier.warning({custom_message: "Debe seleccionar una imagen"});
      }
      else {
        Upload.upload({
          url: ApiHost+ 'brands',
          data: {
            brand: vm.brand,
            document_type: vm.document_type,
            file: vm.new_brand_photo_file
          }
        })
        .then(function () {
          Notifier.success({custom_message: 'Marca ' + vm.brand.name + ' creada.'});
          $state.go('admin.brands.list');        
        },function () {        
        }, function () {
        });        
      }
    };    
    
    //UPLOAD BRAND IMAGE    
    vm.open_upload_brand_photo = function() {
      $timeout(function() {
        angular.element('#upload_brand_photo').trigger('click');
      }, 100);
    };
    
    vm.on_change_select_photo = function(files) {
      if (angular.isUndefined(files[0])) {
        return;
      }
      
      var file_extension = files[0].name.split(".").pop();
      
      if (!is_valid_file_extension(file_extension)) {
        Notifier.warning({custom_message: "Formatos soportados: JPG y PNG."});
        vm.new_brand_photo_file = null;
        return true;
      }
      
      if (!is_valid_photo(vm.file_size)) {
        Notifier.warning({custom_message: "El tamaño permitido es de " + vm.file_size.other});
        vm.new_brand_photo_file = null;
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
      var file_size = vm.new_brand_photo_file.size;
      var file_size_mega_bytes = file_size / (1000 * 1000);
      var file_size_permited = parseFloat(vm_size.other);
      
      if (file_size_mega_bytes > file_size_permited ) {        
        return false;
      }
      
      return true;
    }
  }  
})();