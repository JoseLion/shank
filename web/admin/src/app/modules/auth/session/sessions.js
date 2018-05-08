(function() {
  'use strict';
  
  angular.module('Session')
  .factory('session', function($sessionStorage, _) {
  
    var user_profile;
  
    return {
      store: function (profile) {
        $sessionStorage.session = profile;
        user_profile = profile;
      },
  
      recover: function () {
        return user_profile;
      },
  
      permissions: function() {
        return this.recover().permissions;
      },
  
      permission_names: function() {
        return _.chain(this.recover())
        .pluck('permissions')
        .flatten()
        .uniq()
        .value();
      },
  
      remove: function () {
        $sessionStorage.session = {};
        user_profile = {};
      },
      
      update_user_fullname: function(profile) {
        $sessionStorage.session.surname = profile.user.surname;
        $sessionStorage.session.name = profile.user.name;
        $sessionStorage.session.photo = profile.user.photo;
      }
    };
  });
})();