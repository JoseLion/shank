(function() {
  'use strict';
  
  angular.module('core.directives')
  .directive('authorizeSection', function($parse, session, _) {
    
    return {
      restrict: 'A',
      scope: {
        authorizeSection: '='
      },
      transclude:'element',
      priority: 900,
      link: function(scope, element, attributes, nullController, transclude) {
        var permissions = session.permissions();
        
        var authorize_show = scope.authorizeSection;
        if (!_(authorize_show).isArray()) {
          authorize_show = [authorize_show];
        }
        
        var has_permission = _(authorize_show).reduce(function(memo, string) {
          var negated_permission = (string.indexOf('!') === 0);
          if (negated_permission) { string = string.replace('!', ''); }
          
          var string_has_permission = determine_string_permissions(string);
          
          if (negated_permission) { string_has_permission = !string_has_permission; }
          
          return memo || string_has_permission;
          
        }, false);
        
        var childScope = scope.$parent.$new();
        transclude(childScope, function(clone) {
          
          if (!has_permission) {
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
        
        function determine_string_permissions(string) {
          var split = string.split('.');
          var actions = [split[0], split[1]];
          
          if (split.length > 2) {
            var rest = _(split).chain().rest().rest().value();
            actions.push(rest.join('.'));
          }
  
          if (actions.length === 3) {
            var module = _(actions).initial().join('.');
            var module_permissions = $parse(module)(permissions);
            
            var has_permission = _(module_permissions).contains(actions[2]) || _(module_permissions).contains('all');
            
            if(!has_permission && module_permissions && _(module_permissions[0]).isString()){
              return _(module_permissions).contains(actions[2]);
            }
            
            return has_permission;
          }
          
          if (string.match('current_action')) {
            string = string.replace('current_action', scope.$parent.current_action);
          }
          
          return Boolean($parse(string)(permissions).length);
        }
      }
    };
  });
})();