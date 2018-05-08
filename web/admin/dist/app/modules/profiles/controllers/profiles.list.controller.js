(function() {
  'use strict';
  
  angular
  .module('admin.profiles')
  .controller('profilesListController', profilesListController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.profiles.list', {
        url: '/list',
        title: 'Perfiles',
        templateUrl: 'app/modules/profiles/views/profiles.list.html',
        controller: 'profilesListController',
        controllerAs: 'profileCtrl',
        resolve: {
          profiles: function(profiles_model) {
            return profiles_model.get();
          }
        }
      });
  });
  
  function profilesListController($state, profiles_model, profiles, Notifier, _) {
    var vm = this;
    
    vm.profiles = profiles;
    
    vm.edit_profile = function(profile) {
      $state.go('admin.profiles.update', { _id: profile._id });
    }
    
    vm.remove_profile = function(profile) {
      vm.close_remove_profile_modal = false;
      vm.profile = profile;
    }
    
    vm.delete_profile = function() {
      vm.close_remove_profile_modal = true;
      profiles_model().remove({id: vm.profile.id}).then(function() {
        Notifier.success({action: 'deleted', element: 'profile', identifier: vm.profile.name});
        vm.profiles = _(vm.profiles).without(vm.profile);
      });
    }
  }
})();