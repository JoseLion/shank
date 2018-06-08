(function() {
  'use strict';
  
  angular
  .module('public.contact.us')
  .controller('contactUsController', contactUsController)
  .config(function($stateProvider) {
    $stateProvider
      .state('contact_us', {
        url: '/contact-us',
        title: 'Contact Us',
        templateUrl: 'app/modules/contact_us/views/contact.us.html',
        controller: 'contactUsController',
        controllerAs: 'contactCtrl'
      });
  });
  
  function contactUsController(vcRecaptchaService, contact_us_model) {
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