(function() {
  'use strict';
  
  angular
  .module('admin.tournament.settings')
  .controller('webLinksController', webLinksController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.administration.web_links', {
        url: '/web-links',
        title: 'Web Links',
        templateUrl: 'app/modules/web_links/views/web.links.html',
        controller: 'webLinksController',
        controllerAs: 'webLinksCtrl',
        resolve: {
          web_link: function(app_settings_model) {
            return app_settings_model.get_app_settings({code: 'WLK'});
          }
        }
      });
  });
  
  function webLinksController(web_link, app_settings_model, Notifier, _) {
    var vm = this;
    
    if (_.isEmpty(web_link)) {
      vm.web_link = {code: 'WLK', name: 'Web links', values: [{name: 'Privacy Policy'}, {name: 'Terms of Service'}, {name: 'Rules'}]};
    }
    else {
      format_data_to_display(web_link);
    }
    
    function format_data_to_display(_web_links) {
      vm.web_link = angular.copy(_web_links);
      vm.web_link.values = [];
      
      _.each(_web_links.values, function(link, index) {
        vm.web_link.values.push(build_values(link, index));
      });
    }
    
    function build_values(link, index) {
      var data = {value: link};
      
      switch(index) {
        case 0:
          data.name = 'Privacy Policy';
          break;
        case 1:
          data.name = 'Terms of Service';
          break;
        case 2:
          data.name = 'Rules';
          break;
      }
      
      return data;
    }
    
    vm.save = function() {
      app_settings_model.save_web_link(prepare_data()).then(function(res_data) {
        Notifier.success({custom_message: 'Saved web link'});
        format_data_to_display(res_data);
      });
    }
    
    function prepare_data() {
      var vm_web_link = angular.copy(vm.web_link);
      
      vm_web_link.values = [];
      
      _.each(vm.web_link.values, function(link) {
        vm_web_link.values.push(link.value);
      });
      
      return vm_web_link;
    }
  }
})();