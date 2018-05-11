(function () {
  'use strict';
  
  angular.module('core.directives')
  .directive('modal', function($parse, _) {
    
    return function(scope, element, attrs) {
      
      element.attr('id', attrs.modal);
      element.addClass('modal fade');
      
      var submit_button = angular.element(element).find('form');
      
      if (!_(attrs).has('hideOnSubmit')) {
        submit_button.on('submit', function() {
          angular.element(element).modal('hide');
        });
      }
      else {
        submit_button.on('submit', function() {
          if(attrs.hideOnSubmit === 'true') {
            angular.element(element).modal('hide');
          }
        });
        
        scope.$on('form_successfully_saved', function() {
          angular.element(element).modal('hide');
        });
      }
      
      if (attrs.onClose) {
        angular.element(element).on('hidden.bs.modal', function () {
          scope.$apply(function() { $parse(attrs.onClose)(scope); });
        });
      }
    };
  });
})();