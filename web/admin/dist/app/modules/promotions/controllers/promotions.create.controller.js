(function() {
  'use strict';
  
  angular
  .module('admin.promotions')
  .controller('promotionsCreateController', promotionsCreateController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.promotions.create', {
        url: '/create',
        title: 'Nueva Promocion',
        templateUrl: 'app/modules/promotions/views/promotions.create.html',
        controller: 'promotionsCreateController',
        controllerAs: 'promotionCtrl',
        resolve: {
          initial_data: function(promotions_model, Catalog) {
            return promotions_model.initial_data({code_document_type: Catalog.document_type_promotion, code_file_size: Catalog.file_size, code_promotion_types: Catalog.promotion_types, code_promotion_type_category: Catalog.promotion_type_category});
          }           
        }         
      });
  });
  
  function promotionsCreateController($rootScope, Upload, ApiHost, $timeout, $uibModal, Notifier, $state, catalogs_model, Catalog, promotions_model, initial_data) {
    var vm = this;

    vm.file_size = initial_data.file_size;
    vm.document_type = initial_data.document_type;    
    vm.promotion_types = initial_data.promotion_types;
    vm.promotion_categories = initial_data.promotion_categories;
    vm.brands = initial_data.brands;
    vm.specifications_modal = [];

    vm.save = function() {
      
      if (!is_valid_data_before_to_save()) {
        Notifier.warning({custom_message: 'Debe llemar por lo menos un campo.'});
        return;
      }
      
      if (!vm.new_promotion_photo_file) {
        Notifier.warning({custom_message: "Debe seleccionar una imagen"});
      }
      else {
        save_data(); 
      }
    };
    
    function save_data() {
      Upload.upload({
        url: ApiHost + 'promotions',
        data: {
          promotion: vm.promotion,
          document_type: vm.document_type,
          file: vm.new_promotion_photo_file
        }
      })
      .then(function () {
        Notifier.success({custom_message: 'Promoción creada.'});
        $state.go('admin.promotions.list');        
      },function () {
      }, function () {
      });
    }
    
    function is_valid_data_before_to_save() {
      
      if (_.isEmpty(vm.promotion)) {
        return false;
      }
      
      if (!_.isEmpty(vm.promotion.categories)) {
        return true;
      }
      
      if (!_.isEmpty(vm.promotion.brands)) {
        return true;
      }
      
      if (vm.promotion.specifications && (vm.promotion.specifications.high || vm.promotion.specifications.rin || vm.promotion.specifications.width)) {
        return true;
      }
      
      return false;
    }
    
    //UPLOAD PROMOTION IMAGE    
    vm.open_upload_promotion_photo = function() {
      $timeout(function() {
        angular.element('#upload_promotion_photo').trigger('click');
      }, 100);
    };
    
    vm.on_change_select_photo = function(files) {
      if (angular.isUndefined(files[0])) {
        return;
      }
      
      var file_extension = files[0].name.split(".").pop();
      
      if (!is_valid_file_extension(file_extension)) {
        Notifier.warning({custom_message: "Formatos soportados: JPG y PNG."});
        vm.new_promotion_photo_file = null;
        return true;
      }
      
      if (!is_valid_photo(vm.file_size)) {
        Notifier.warning({custom_message: "El tamaño permitido es de " + vm.file_size.other});
        vm.new_promotion_photo_file = null;
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
      var file_size = vm.new_promotion_photo_file.size;
      var file_size_mega_bytes = file_size / (1000 * 1000);
      var file_size_permited = parseFloat(vm_size.other);
      
      if (file_size_mega_bytes > file_size_permited ) {        
        return false;
      }
      
      return true;
    }    
    
    vm.open_specifications_modal = function(specification_promotion) {
      var specifications_promotions_modal = $uibModal.open({
        templateUrl: "app/modules/promotions/views/specifications.promotions.modal.html",
        controller: 'SpecificationsPromotionsController',
        controllerAs: 'specificationPromoCtrl',
        backdrop: 'static',
        resolve: {
          specification_promotion: function () {
            return specification_promotion;
          }      
        }
      });
      if (specification_promotion) {
        var index = vm.specifications_modal.indexOf(specification_promotion);      
        specifications_promotions_modal.result.then(function(modal_response) {
          if (modal_response) {         
            vm.specifications_modal[index] = modal_response;
          }
        });        
      }else{
        specifications_promotions_modal.result.then(function(modal_response) {          
          if (modal_response) {
            vm.specifications_modal.push(modal_response);          
          }
        });         
      }      
    };
    
    vm.open_remove_specifications_modal = function(specification_promotion) {
      var remove_specification_modal = $uibModal.open({
        templateUrl: "app/modules/promotions/views/specifications.promotions.remove.modal.html",
        controller: 'removeSpecificationPromotionController',
        controllerAs: 'removeSpecificationPromoCtrl',
        backdrop: 'static',
        resolve: {
          specification_promotion: function () {
            return specification_promotion;
          },
          specifications_promotion: function() {
            return vm.specifications_modal;
          }
        }
      });
      
      remove_specification_modal.result.then(function(modal_response) {
        if (modal_response) {
          vm.specifications_modal = modal_response;
        }
      });
    };
  }
})();