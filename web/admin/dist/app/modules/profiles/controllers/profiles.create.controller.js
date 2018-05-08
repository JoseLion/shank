(function() {
  'use strict';
  
  angular.module('admin.profiles')
  .controller('admProfileCreateController', admProfileCreateController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.profiles.create', {
        url: '/create',
        title: 'Crear Perfiles',
        templateUrl: 'app/modules/profiles/views/profiles.create.html',
        controller: 'admProfileCreateController',
        controllerAs: 'profileCtrl',
        resolve: {
          permissions: function(permissions_model) {
            return permissions_model.get();
          }
        }
      });
  });
  
  function admProfileCreateController($state, permissions, profiles_model, Notifier, profile_services, _) {
    var vm = this;
    vm.profile = {};
    vm.modules = profile_services.format_module_with_permissions(permissions);
    
    vm.is_checked_all_modules = false;
    
    parse_modules(false);
    
    function parse_modules(status_permission) {
      _(vm.modules).each(function(module) {
        module.is_checked = status_permission;
        parse_permissions_by_module(module, status_permission);
      });
    }
    
    function parse_permissions_by_module(module, status_permission) {
      _(module.permissions).each(function(permission) {
        permission.is_checked = status_permission;
      });
    }
    
    vm.check_permissions_all_modules = function() {
      
      if (vm.is_checked_all_modules) {
        parse_modules(true);
        return
      }
      
      parse_modules(false);
    }
    
    vm.validate_permissions_by_module = function(module) {
      validate_check_of_module(module);
      validate_permissions_all_modules();
    }
    
    function validate_check_of_module(module) {
      var module_is_checked = true;
      
      _(module.permissions).each(function(permission) {
        if (!permission.is_checked) {
          module_is_checked = false;
        }
      });
      
      module.is_checked = module_is_checked;
    }
    
    function validate_permissions_all_modules() {
      var is_checked_all_permissions = true;
      
      _(vm.modules).each(function(module) {
        _(module.permissions).each(function(permission) {
          if (!permission.is_checked) {
            is_checked_all_permissions = false;
          }
        });
      });
      
      if (is_checked_all_permissions) {
        vm.is_checked_all_modules = true;
      }
      else {
        vm.is_checked_all_modules = false;
      }
    }
    
    vm.check_permissions_by_module = function(module) {
      if (module.is_checked) {
        parse_permissions_by_module(module, true);
      }
      else {
        parse_permissions_by_module(module, false);
      }
      validate_permissions_all_modules();
    }
    
    vm.save = function() {
      vm.profile.permissions = format_permissions();
      
      profiles_model.create(vm.profile).then(function() {
        Notifier.success({custom_message: 'Perfil ' + vm.profile.name + ' creado.'});
        $state.go('admin.profiles.list');
      });
    }
    
    function format_permissions() {
      var permissions = [];
      
      _(vm.modules).each(function(module) {
        _(module.permissions).each(function(permission) {
          if (permission.is_checked) {
            permissions.push(permission.action);
          }
        });
      });
      
      return permissions;
    }
  }
})();