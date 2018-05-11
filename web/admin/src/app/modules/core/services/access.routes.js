(function() {
  
  'use strict';
  
  angular.module('core.services').factory('access_routes', function(session, _) {
    
    var permissions, permission, splited_state, module, action;
    
    var method_action = {
      list: 'find',
      update: 'update',
      create: 'create',
      remove: 'remove'
    };
    
    var states_without_validation = [
      'login',
      'forgot_password',
      'admin.dashboard',
      'not_found',
      'admin.internal_error'
    ];
    
    function determine_string_permissions(state) {
      
      if (_.contains(states_without_validation, state)) {
        return true;
      }
      
      permissions = session.permission_names();
      permission = get_permission_name(state);
      
      return _.contains(permissions, permission);
    }
    
    function get_permission_name(state) {
      splited_state = state.split('.');
      module = splited_state[0];
      action = splited_state[1];
      
      if (splited_state[0] === 'admin') {
        module = splited_state[1];
        action = splited_state[2];
      }
      
      if (method_action[action]) {
        return module + "_can_" + method_action[action];
      }
      
      return module + "_can_" + action;
    }
    
    return {
      has_access: function(state) {
        return determine_string_permissions(state);
      }
    };
  });
})();