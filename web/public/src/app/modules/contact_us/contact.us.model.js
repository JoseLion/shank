(function() {
  'use strict';
  
  angular.module('public.contact.us').factory('contact_us_model', function(base_model) {
    var model = base_model('contact_us');
    
    model.send_contact = function(params) {
      return base_model('send_contact').create(params);
    }
    
    return model;
  });
})();