(function() {
  'use strict';
  
  angular
  .module('admin.advertisements')
  .controller('advertisementsCreateController', advertisementsCreateController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.advertisements.create', {
        url: '/create',
        title: 'Nueva Marca',
        templateUrl: 'app/modules/advertisements/views/advertisements.create.html',
        controller: 'advertisementsCreateController',
        controllerAs: 'advertisementCtrl',
        resolve: {
          initial_data: function(advertisements_model, Catalog) {
            return advertisements_model.initial_data({code_advertisements_type: Catalog.advertisements_type});
          }
        }         
      });
  });
  
  function advertisementsCreateController($rootScope, $state, advertisements_model, initial_data, Notifier, _) {
    var vm = this;
    
    vm.types = initial_data.types;
    
    view_types();
    
    //verify types selected
    function view_types() {      
      _.each(initial_data.advertisements, function(advertisement) {
        var type_selected = _.findWhere(vm.types, {_id: advertisement.type});
        vm.types = _.without(vm.types, type_selected);         
      });
    }
         
    vm.save = function() {
      if (vm.advertisement.text_html.trim()==="") {
        Notifier.warning({custom_message: 'Se debe ingresar un texto'});
      }else{
        advertisements_model.create(vm.advertisement).then(function() {
          Notifier.success({custom_message: 'Publicidad creada.'});
          $state.go('admin.advertisements.list');
        });        
      }

    };      
 
  }  
})();