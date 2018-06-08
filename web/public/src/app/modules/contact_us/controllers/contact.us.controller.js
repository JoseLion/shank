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
  
  function contactUsController() {
    var vm = this;
  }
})();