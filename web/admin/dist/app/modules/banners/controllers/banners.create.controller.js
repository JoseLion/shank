(function() {
  'use strict';
  
  angular
  .module('admin.banners')
  .controller('bannersCreateController', bannersCreateController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.banners.create', {
        url: '/create',
        title: 'Nuevo Banner',
        templateUrl: 'app/modules/banners/views/banners.create.html',
        controller: 'bannersCreateController',
        controllerAs: 'bannerCtrl',
        resolve: {
          initial_data: function(banners_model, Catalog) {
            return banners_model.initial_data({code_document_type: Catalog.document_type_brand, code_file_size: Catalog.file_size, parent_code_pages_type: Catalog.page_type, parent_code_categories_type: Catalog.categories_type});
          }          
        }
      });
  });
  
  function bannersCreateController($rootScope, $state,Upload, ApiHost, $timeout, banners_model, initial_data, Notifier, Catalog, _) {
    var vm = this;
    
    vm.pages = initial_data.pages;
    vm.categories = initial_data.categories;
    vm.document_type = initial_data.document_type;
    vm.file_size = initial_data.file_size;
    vm.brands = initial_data.brands;
    vm.document_type = initial_data.document_type;
    
    vm.category_options = false;
    vm.brand_options = false;
    
    vm.save = function() {
      if (!vm.new_banner_photo_file) {
        Notifier.warning({custom_message: "Debe seleccionar una imagen"});
      }else{
        parse_data();
        Upload.upload({
          url: ApiHost+ 'banners',
          data: {
            banner: vm.banner,
            document_type: vm.document_type,
            file: vm.new_banner_photo_file
          }
        })
        .then(function () {
          Notifier.success({custom_message: 'Banner' + vm.banner.name + ' creado.'});
          $state.go('admin.banners.list');        
        },function () {        
        }, function () {
        });        
      }      
    };    
    
    function parse_data(){     
      if (vm.category_options) {
        delete vm.banner['brand'];
      }
      if (vm.brand_options) {
        delete vm.banner['category'];
      }
      if (!vm.brand_options && !vm.category_options) {
        delete vm.banner['brand'];
        delete vm.banner['category'];
      }       
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
        return;
      }
      var file_extension = files[0].name.split(".").pop();
      if (!is_valid_file_extension(file_extension)) {
        Notifier.warning({custom_message: "Formatos soportados: JPG y PNG."});
        vm.new_banner_photo_file = null;
        return true;
      }
      if (!is_valid_photo(vm.file_size)) {
        Notifier.warning({custom_message: "El tamaño permitido es de "+vm.file_size.other});
        vm.new_banner_photo_file = null;
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