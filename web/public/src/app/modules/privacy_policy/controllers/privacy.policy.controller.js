(function() {
  'use strict';
  
  angular
  .module('public.privacy.policy')
  .controller('privacyPolicyController', privacyPolicyController)
  .config(function($stateProvider) {
    $stateProvider
      .state('privacy_policy', {
        url: '/privacy-policy',
        title: 'Privacy Policy',
        templateUrl: 'app/modules/privacy_policy/views/privacy.policy.html',
        controller: 'privacyPolicyController',
        controllerAs: 'privacyPolicyCtrl'
      });
  });
  
  function privacyPolicyController(vcRecaptchaService, contact_us_model) {
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