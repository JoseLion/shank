(function() {
  'use strict';
  
  angular
  .module('admin.profiles')
  .controller('admProfileUpdateController', admProfileUpdateController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.profiles.update', {
        url: '/update/:_id',
        title: 'Editar Perfil',
        templateUrl: 'app/modules/profiles/views/profiles.update.html',
        controller: 'admProfileUpdateController',
        controllerAs: 'profileCtrl',
        resolve: {
          profile: function(profiles_model, $stateParams) {
            return profiles_model.get($stateParams._id);
          },
          permissions: function(permissions_model) {
            return permissions_model.get();
          }
        }
      });
  });
  
  function admProfileUpdateController($state, profile, permissions, profiles_model, Notifier, socket, profile_services, _) {
    var vm = this;
    
    vm.profile = profile;
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
    
    set_permissions();
    
    function set_permissions() {
      
      var is_checked_all_modules = true;
      
      _(vm.modules).each(function(module) {
        
        var is_checked_all_permissions_of_the_module = true;
        
        _(module.permissions).each(function(permission) {
          if (_(vm.profile.permissions).indexOf(permission.action) != -1) {
            permission.is_checked = true;
          }
          else {
            is_checked_all_permissions_of_the_module = false;
          }
        });
        
        module.is_checked = is_checked_all_permissions_of_the_module;
        
        if (!module.is_checked) {
          is_checked_all_modules = false;
        }
      });
      
      vm.is_checked_all_modules = is_checked_all_modules;
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
    
    vm.update = function() {
      
      vm.profile.permissions = format_permissions();
      
      profiles_model.update(vm.profile).then(function() {
        socket.emit('profile-updated', vm.profile._id);
        Notifier.success({custom_message: 'Perfil ' + vm.profile.name + ' actualizado.'});
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