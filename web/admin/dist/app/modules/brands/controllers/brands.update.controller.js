(function() {
  'use strict';
  
  angular.module('admin.brands')
  .controller('brandUpdateController', brandUpdateController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.brands.update', {
        url: '/update/:_id',
        title: 'Editar Marca',
        templateUrl: 'app/modules/brands/views/brands.update.html',
        controller: 'brandUpdateController',
        controllerAs: 'brandCtrl',
        resolve: {
          brand: function(brands_model, $stateParams) {
            return brands_model.get($stateParams._id);
          },
          initial_data: function(brands_model, Catalog) {
            return brands_model.initial_data({code_document_type: Catalog.document_type_brand, code_file_size: Catalog.file_size});
          }            
        }
      });
  });
  
  function brandUpdateController($state, Upload, ApiHost, $timeout, brands_model, Notifier, brand, initial_data) {
    var vm = this;
    vm.file_size = initial_data.file_size;
    vm.document_type = initial_data.document_type;
    vm.brand = brand;
    var is_edit_image = false;

    vm.update = function() {

      var data_up = vm.brand;
      var file_up = {};
      if (is_edit_image) {
        file_up = vm.new_brand_photo_file;
      }

      Upload.upload({
        url: ApiHost+ 'brands_update_by_id/'+data_up._id,        
        data: {
          brand: data_up,
          document_type: vm.document_type,
          file: file_up
        }        
      })
      .then(function () {
        Notifier.success({custom_message: 'Marca' + data_up.name + ' Actualizada.'});
        $state.go('admin.brands.list');        
      },function () {        
      }, function () {
      });
    };     
    
 //UPLOAD BRAND IMAGE    
    vm.open_upload_brand_photo = function() {
      $timeout(function() {
        angular.element('#upload_brand_photo').trigger('click');
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
        vm.new_brand_photo_file = null;
        return true;
      }
      if (!is_valid_photo(vm.file_size)) {
        is_edit_image = false;
        Notifier.warning({custom_message: "El tamaño permitido es de "+vm.file_size.other});
        vm.new_brand_photo_file = null;
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