(function() {
  'use strict';
  
  angular.module('admin.banners')
  .controller('bannerUpdateController', bannerUpdateController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.banners.update', {
        url: '/update/:_id',
        title: 'Editar Marca',
        templateUrl: 'app/modules/banners/views/banners.update.html',
        controller: 'bannerUpdateController',
        controllerAs: 'bannerCtrl',
        resolve: {
          banner: function(banners_model, $stateParams) {
            return banners_model.get($stateParams._id);
          },
          initial_data: function(banners_model, Catalog) {
            return banners_model.initial_data({code_document_type: Catalog.document_type_brand, code_file_size: Catalog.file_size, parent_code_pages_type: Catalog.page_type, parent_code_categories_type: Catalog.categories_type});
          }           
        }
      });
  });
  
  function bannerUpdateController($state, banners_model, Upload, ApiHost, $timeout, Notifier, banner, Catalog, _, initial_data) {
    var vm = this;
    var is_edit_image = false;
    var brand_is_null = false;
    var category_is_null = false;
    
    vm.pages = initial_data.pages;
    vm.categories = initial_data.categories;
    vm.brands = initial_data.brands;        
    vm.banner = banner;
    vm.document_type = initial_data.document_type;
    vm.file_size = initial_data.file_size;

    start_cmbs();
    
    function start_cmbs() {
      if (vm.banner.category) {
        vm.category_options = true;
        vm.brand_options = false;
        category_is_null = true;
      }
      
      if (vm.banner.brand) {
        vm.brand_options = true;
        vm.category_options = false;
        brand_is_null = true;
      }
    }
    
    vm.update = function() {
    
      var data_up = prepare_data_to_update();
      var file_up = {};
      if (is_edit_image === true) {
        file_up = vm.new_banner_photo_file;
      }

      Upload.upload({
        url: ApiHost+ 'banners_update_by_id/' + data_up._id,        
        data: {
          banner: data_up,
          document_type: vm.document_type,
          file: file_up
        }        
      })
      .then(function () {
        Notifier.success({custom_message: 'Banner' + data_up.name + ' Actualizado.'});
        $state.go('admin.banners.list');        
      },function () {        
      }, function () {
      });
    };
    
    function prepare_data_to_update() {
      var edit_banner = {};
      
      edit_banner._id = vm.banner._id;
      edit_banner.name = vm.banner.name;
      edit_banner.page = vm.banner.page;
      if (vm.category_options) {
        edit_banner.category = vm.banner.category;
        if (brand_is_null) {
          edit_banner.brand = null;
        }        
      }
      if (vm.brand_options) {
        edit_banner.brand = vm.banner.brand;
        if (category_is_null) {
          edit_banner.category = null;
        }         
      }
      if (!vm.category_options && !vm.brand_options) {
        edit_banner.brand = null;
        edit_banner.category = null;
      }
      if (vm.banner.document_base) {
        edit_banner.document_base = vm.banner.document_base;
      }    
      return edit_banner;
    }    

    vm.get_options_page_select = function () {
      var page = _.findWhere(vm.pages, {_id: vm.banner.page});
      if (page) {
        switch (page.code) {
          case Catalog.home_type:
            vm.category_options = false;
            vm.brand_options = false;
            vm.banner.brand = '';
            vm.banner.category = '';
            break;
          case Catalog.categories_type:
            vm.category_options = true;
            vm.brand_options = false;
            vm.banner.brand = '';            
            break;
          case Catalog.brand_type:
            vm.category_options = false;
            vm.brand_options = true;
            vm.banner.category = '';            
            break;
        }            
      }
    };
    
    //UPLOAD BANNER IMAGE    
    vm.open_upload_banner_photo = function() {
      $timeout(function() {
        angular.element('#upload_banner_photo').trigger('click');
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
        vm.new_banner_photo_file = null;
        return true;
      }
      if (!is_valid_photo(vm.file_size)) {
        is_edit_image = false;
        Notifier.warning({custom_message: "El tamaño permitido es de "+vm.file_size.other});
        vm.new_banner_photo_file = null;
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
      var file_size = vm.new_banner_photo_file.size;
      var file_size_mega_bytes = file_size / (1000 * 1000);
      var file_size_permited = parseFloat(vm_size.other);
      
      if (file_size_mega_bytes > file_size_permited ) {        
        return false;
      }
      
      return true;
    }       

  }
})();