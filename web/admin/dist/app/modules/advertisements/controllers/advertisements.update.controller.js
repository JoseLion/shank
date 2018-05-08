(function() {
  'use strict';
  
  angular.module('admin.advertisements')
  .controller('advertisementUpdateController', advertisementUpdateController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.advertisements.update', {
        url: '/update/:_id',
        title: 'Editar Publicidad',
        templateUrl: 'app/modules/advertisements/views/advertisements.update.html',
        controller: 'advertisementUpdateController',
        controllerAs: 'advertisementCtrl',
        resolve: {          
          advertisement: function(advertisements_model, $stateParams) {
            return advertisements_model.get($stateParams._id);
          },
          initial_data: function(advertisements_model, Catalog) {
            return advertisements_model.initial_data({code_advertisements_type: Catalog.advertisements_type});
          }          
        }
      });
  });
  
  function advertisementUpdateController($state, advertisements_model, Notifier, initial_data, advertisement, _) {
    var vm = this;
    
    vm.types = initial_data.types;
    vm.advertisement = advertisement;
    
    view_types();
    
    //verify types selected
    function view_types() {
      _.each(initial_data.advertisements, function(advertisement) {
        var type_selected = _.findWhere(vm.types, {_id: advertisement.type});
        if (advertisement.type !== vm.advertisement.type) {
          vm.types = _.without(vm.types, type_selected); 
        }              
      });
    }    

    vm.update = function() {
      if (vm.advertisement.text_html.trim()==="") {
        Notifier.warning({custom_message: 'Se debe ingresar un texto'});
      }else{
        advertisements_model.update(vm.advertisement).then(function() {
          Notifier.success({custom_message: 'Publicidad Actualizada.'});
          $state.go('admin.advertisements.list');
        });        
      }
    };    

  }
})();