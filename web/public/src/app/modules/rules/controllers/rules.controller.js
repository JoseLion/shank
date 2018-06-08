(function() {
  'use strict';
  
  angular
  .module('public.rules')
  .controller('RulesController', RulesController)
  .config(function($stateProvider) {
    $stateProvider
      .state('rules', {
        url: '/rules',
        title: 'Rules',
        templateUrl: 'app/modules/rules/views/rules.html',
        controller: 'RulesController',
        controllerAs: 'RulesCtrl'
      });
  });
  
  function RulesController(vcRecaptchaService, contact_us_model) {
    var vm = this;
    
    vm.form = {
      key: '6LdQD14UAAAAAI-vbCJreBgwxqzucsBJ9Kdhepqm'
    };
    
    vm.setResponse = function (response) {
      console.info('Response available');
      vm.response = response;
    };
    
    vm.setWidgetId = function (widgetId) {
      console.info('Created widget ID: %s', widgetId);
      vm.widgetId = widgetId;
    };
    
    vm.cbExpiration = function() {
      console.info('Captcha expired. Resetting response object');
      vcRecaptchaService.reload(vm.widgetId);
      vm.response = null;
    };
    
    vm.send_contant = function() {
      if (!vm.response) {
        vcRecaptchaService.reload(vm.widgetId);
        return;
      }
      
      contact_us_model.send_contact().then(function() {
        vcRecaptchaService.reload(vm.widgetId);
      });
    }
  }
})();