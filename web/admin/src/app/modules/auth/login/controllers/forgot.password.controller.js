(function() {
  'use strict';
  
  angular.module('login')
  .controller('forgotPasswordController', forgotPasswordController)
  .config(function ($stateProvider) {
    $stateProvider
      .state('forgot_password', {
        url: '/forgot_password',
        title: 'Forgot Password',
        templateUrl: 'app/modules/auth/login/views/forgot.password.html',
        controller: 'forgotPasswordController',
        controllerAs: 'forgotCtrl'
      });
  });
  
  function forgotPasswordController($http, $state, ApiHost, Notifier) {
    var vm = this;
    
    vm.credentials = {};
    
    vm.forgot_password = function() {
      
      if (!vm.sending_email) {
        vm.sending_email = true;
        
        var recovery_password = $http.post(ApiHost + 'recovery_password_admin_user', vm.credentials);
        
        recovery_password.success(function(result) {
          vm.sending_email = false;
          
          if (result.error) {
            Notifier.error({custom_message: result.error});
          }
          else {
            $state.go('login');
          }
        });
        
        recovery_password.error(function(error) {
          vm.sending_email = false;
          Notifier.error({custom_message: error.error});
        });
      }
    }
  }
})();