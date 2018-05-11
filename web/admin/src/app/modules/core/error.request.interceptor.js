(function() {
  
  'use strict';
  
  angular.module('core')
  .service('error_request_interceptor', function($injector, $q, $log) {
    
    return {
      responseError: function(response) {
        $log.log(response);
        
        //$injector.get('blockUI').stop();
        
        if (response.status === 404) {
          $injector.get('Notifier').error({custom_message: response.data.error});
        }
        
        if (response.status === 500) {
          $injector.get('Notifier').error({custom_message: response.data.error});
        }
        
        if (response.status === 403) {
          $injector.get('auth_service').logout();
          $injector.get('$state').go('login', {}, {reload: true});
        }
        
        if (response.status === 401 || response.status === 0 || response.status === -1) {
          $injector.get('Notifier').error({custom_message: response.data.error});
          $injector.get('auth_service').logout();
          $injector.get('$state').go('login', {}, {reload: true});
        }
        return $q.reject(response);
      },
			request: function(config) {
				return config;
			}
    };
  });
}());