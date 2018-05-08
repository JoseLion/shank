(function() {
  'use strict';
  
  angular.module('core.directives')
  .directive('accessSection', function($parse, session, _) {
    
    return {
      restrict: 'A',
      scope: {
        accessSection: '='
      },
      transclude:'element',
      priority: 900,
      link: function(scope, element, attributes, nullController, transclude) {
        var permissions = session.permissions();
        
        var authorize_show = scope.accessSection;
        var has_permission = determine_string_permissions(authorize_show);
        
        var childScope = scope.$parent.$new();
        transclude(childScope, function(clone) {
          
          if(!has_permission){
            angular.element(clone).remove();
            angular.element(element).remove();
            childScope.$destroy();
            return;
          }
          
          element.after(clone);
          
          // TO PREVENT MEMORY LEAKS
          scope.$on('$destroy', function() {
            angular.element(clone).remove();
            angular.element(element).remove();
            childScope.$destroy();
          });
          // TO PREVENT MEMORY LEAKS
  
        });
        
        function determine_string_permissions(action) {
          return _(permissions.permissions_names).contains(action);
        }
      }
    };
  });
})();