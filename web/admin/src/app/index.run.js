(function() {
  'use strict';

  angular
    .module('durallantaAdmin')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, $state, Host, auth_service, socket) {

    $log.debug('runBlock end');
    
    var stateChangeStart = $rootScope.$on('$stateChangeStart', function (event, toState) {
      if (!auth_service.isAuthenticated()) {
        if (toState.name != 'login' && toState.name != 'forgot_password') {
          event.preventDefault();
          $state.go('login');
        }
      }
    });
    
    $rootScope.$on('$destroy', stateChangeStart);
    
    $rootScope.current_user = {};
    
    $rootScope.general_variables = {
      Host: Host,
      copyright: "Copyright Durallanta " + new Date().getFullYear() + "."
    };
    
    $rootScope.messages = {
      empty_records: 'No existen registros',
      check_your_zip_code: 'Consulta tu código postal'
    };
    
    $rootScope.state = $state;
    
    socket.on('notification-profile-updated', function() {
      auth_service.logout();
      alertify
      .okBtn("ACEPTAR")
      .alert("Se han modificado los accesos al sistema, por favor inicia sesión", function (ev) {
        ev.preventDefault();
        $state.go('login');
      }, function(ev) {
        ev.preventDefault();
      });
    });
  }

})();
