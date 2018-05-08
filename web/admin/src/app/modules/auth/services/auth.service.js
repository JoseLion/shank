(function() {
  'use strict';

  angular.module('auth.services')
  .factory('auth_service', function($http, $q, $window, permissions_management, session, ApiHost, socket) {
    
    var user_name = '';
    var user_surname = '';
    var user_profile = '';
    var user_profile_id = '';
    var isAuthenticated = false;
    var role = '';
    var authToken;
    var user_id = '';
    
    function loadUserCredentials() {
      var profile = session.recover();
      
      if (profile) {
        useCredentials(profile);
      }
    }
    
    function storeUserCredentials(profile) {
      session.store(profile);
      useCredentials(profile);
    }
    
    function useCredentials(profile) {
      
      user_id = profile._id;
      user_name = profile.name;
      user_surname = profile.surname;
      user_profile = '';
      user_profile_id = '';
      
      if (profile.profile) {
        socket.emit('user-logged-in', profile.profile._id);
        user_profile_id = profile.profile._id;
        user_profile = profile.profile.name;
      }
      
      isAuthenticated = true;
      authToken = profile.token;
      
      //if (user_name == 'admin') {
        //role = USER_ROLES.admin
      //}
      //if (user_name == 'user') {
        //role = USER_ROLES.public
      //}
      
      // Set the token as header for your requests!
      $http.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;
      $http.defaults.headers.common['Content-Type'] = 'application/json';
    }
    
    function destroyUserCredentials() {
      authToken = undefined;
      user_name = '';
      user_surname = '';
      user_profile = '';
      user_profile_id = '';
      user_id = '';
      isAuthenticated = false;
      $http.defaults.headers.common['Authorization'] = undefined;
      session.remove();
    }
    
    var admin_login = function(credentials) {
      return $q(function(resolve, reject) {

        //if ((credentials.email == 'admin@test.com' && credentials.password == 'test123') || (credentials.email == 'user' && credentials.password == 'test123')) {
        //  // Make a request and receive your auth token from your server
        //  var current_user = {user_id:1, name: 'Angel', surname: 'Dimaria', token: 'DAdsXadecS546asdae'};
        //  current_user.permissions = {users: {find: ['all'], create: ['users'], update:[], remove:[]}};
        //  
        //  storeUserCredentials(current_user);
        //  resolve('Login success.');
        //} else {
        //  reject('Credenciales incorrectas.');
        //}
        //return;
        
        var login = $http.post(ApiHost + 'admin_login', credentials);
        login.success(function(result) {
          
          if (result.error) {
            reject(result.error);
          }
          else {
            
            var current_user = result.response.user;
            current_user.token = result.response.token;
            
            //var permissions = [
            //  {users: {permission_names: ['users_can_find', 'users_can_update', 'users_can_view_report'], remove: [], update: [], create: [], find: ['all']}},
            //  {profiles: {permission_names: ['profiles_can_find'], remove: [], update: [], create: [], find: ['all']}}
            //];
            
            //var permissions = permissions_management.build_permissions(result.response.user.profile.permissions);
            //current_user.permissions = permissions;
            
            storeUserCredentials(current_user);
            resolve(result.response);
          }
        });
        
        login.error(function(error) {
          reject(error);
        });
      });
    };
    
    var logout = function() {
      destroyUserCredentials();
    };
    
    var isAuthorized = function(authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
    };
    
    var register = function(data) {

      destroyUserCredentials();
      
      return $q(function(resolve, reject) {
        
        var register = $http.post(ApiHost + 'register', data);
        
        register.success(function(result) {
          if (result.response.error) {
            reject(result.response.message);
          }
          else{
            storeUserCredentials(result.response);
            resolve('Usuario registrado.');
          }
        });
      });
    }
    
    loadUserCredentials();
   
    return {
      admin_login: admin_login,
      logout: logout,
      isAuthorized: isAuthorized,
      isAuthenticated: function() {return isAuthenticated;},
      user_name: function() {return user_name;},
      user_surname: function() {return user_surname;},
      user_profile: function() {return user_profile;},
      user_profile_id: function() {return user_profile_id;},
      user_id: function() {return user_id;},
      authToken: function() {return authToken;},
      role: function() {return role;},
      register: register
    };
  });
})();