(function() {
  'use strict';
  
  angular.module('core.directives')
  .directive('authorizeFields', function($parse, session, _) {
  
    function remove_unauthorized_fields(fields, paths){
      _(fields).each(function(field) {
        var path = angular.element(field).attr('ng-model') || angular.element(field).attr('ng-bind');
        var base_property_path = _(path.split('.')).first(2).join('.');
  
        if(!_(paths).contains(base_property_path)){
          angular.element(field).parents('.form-group, .field-container, .profile-info-row').first().remove();
        }
      });
    }
  
    return {
      restrict: 'A',
      scope: {
        authorizeFields: '@'
      },
      link: function(scope, element) {
        var permissions = session.permissions();
        var params = scope.authorizeFields.split(/\sin\s|\son\s/);
        var module = params[1];
        var model = params[0];
        var action = params[2];
  
        var authorized_paths = $parse(module + '.' + action)(permissions);
        var original_action_has_all = _($parse(module + '.' + action)(permissions)).contains('all');
        var can_see_paths = $parse(module + '.find')(permissions);
  
        can_see_paths = _(can_see_paths).difference(authorized_paths);
  
        authorized_paths = _(authorized_paths).union(can_see_paths);
  
        if(_(authorized_paths).contains('all')){
  
          authorized_paths = _(authorized_paths).map(function(path) { return model+'.'+path; });
          var all_fields = angular.element(element).find('[ng-model^='+model+']');
  
          _(all_fields).each(function(field) {
            var path = angular.element(field).attr('ng-model') || angular.element(field).attr('ng-bind');
            var base_property_path = _(path.split('.')).first(2).join('.');
  
            if(!_(authorized_paths).contains(base_property_path) && !original_action_has_all){
              angular.element(field).attr('disabled', 'disabled');
            }
          });
  
          return true;
        }
  
        authorized_paths = _(authorized_paths).map(function(path) { return model+'.'+path; });
        can_see_paths = _(can_see_paths).map(function(path) { return model+'.'+path; });
  
        var fields = angular.element(element).find('[ng-model^='+model+'], [ng-bind^='+model+']');
        remove_unauthorized_fields(fields, authorized_paths);
  
        _(can_see_paths).each(function(path) {
          var field = angular.element(element).find('[ng-model^="'+path+'"]');
          field.attr('disabled', 'disabled');
        });
  
      }
    };
  });
})();
