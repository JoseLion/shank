(function () {
  'use strict';
  
  angular.module('core.directives')
  .directive('validateForm', function($parse) {
  
    return {
      require: 'form',
      link: function(scope, element, attrs, form) {
        
        form.$submitted = false;
        var fn = $parse(attrs.validateForm);
        
        element.on('submit', function(event) {
          
          scope.$apply(function() {
            
            form.$submitted = true;
            
            if (form.$valid) {
              fn(scope, { $event : event });
              form.$submitted = false;
              return;
            }
            
            var first_invalid_element = angular.element(element[0].querySelector('.ng-invalid'))[0];
            
            if (first_invalid_element) {
            
              var input = angular.element('input[name="' + first_invalid_element.name + '"]');
              var tab_id = input.parents('.tab-pane').attr('id');
              
              if (tab_id) {
                angular.element('a[data-target="#'+tab_id+'"], a[href="#'+tab_id+'"]').tab('show');
              }
              
              first_invalid_element.focus();
              
              if (first_invalid_element.hasAttribute('datepicker')) {
                angular.element(first_invalid_element).next().focus();
              }
              
              if (first_invalid_element.hasAttribute('chosenselect')) {
                angular.element(first_invalid_element).trigger('chosen:open');
              }
            }
          });
        });
      }
    };
  });
})();