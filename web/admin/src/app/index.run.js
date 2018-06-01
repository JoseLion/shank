(function() {
  'use strict';

  angular
    .module('shankAdmin')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, $state, Host, ApiHost, auth_service, socket) {

    $log.debug('runBlock end');
    
    var stateChangeStart = $rootScope.$on('$stateChangeStart', function (event, toState) {
      if (!auth_service.isAuthenticated()) {
        if (toState.name != 'login' && toState.name != 'forgot_password' && toState.name != 'invitation') {
          event.preventDefault();
          $state.go('login');
        }
      }
      else {
        if (toState.name === 'login' || toState.name === 'forgot_password') {
          event.preventDefault();
          $state.go('admin.dashboard');
        }
      }
    });
    
    $rootScope.$on('$destroy', stateChangeStart);
    
    $rootScope.current_user = {};
    $rootScope.archive_path = ApiHost + 'archive/download';
    
    $rootScope.general_variables = {
      Host: Host,
      copyright: "Shank " + new Date().getFullYear() + "."
    };
    
    $rootScope.messages = {
      empty_records: 'There are no records',
      check_your_zip_code: 'Consulta tu código postal'
    };
    
    $rootScope.state = $state;
    
    socket.on('notification-profile-updated', function() {
      auth_service.logout();
      alertify
      .okBtn("TO ACCEPT")
      .alert("The access to the system has been modified, please login", function (ev) {
        ev.preventDefault();
        $state.go('login');
      }, function(ev) {
        ev.preventDefault();
      });
    });
  }

})();
