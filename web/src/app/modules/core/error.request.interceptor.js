(function() {
  
  'use strict';
  
  angular.module('core')
  .service('error_request_interceptor', function($injector, $q, $log, $cookies, $rootScope) {
    
    return {
      responseError: function(response) {
        
        if (response.status === 404) {
        }
        
        if (response.status === 500) {
        }
        
        if (response.status === 403) {
        }
        
        if (response.status === 401 || response.status === 0 || response.status === -1) {
        }
        return $q.reject(response);
      },
			request: function(config) {
				return config;
			}
    };
  });
  
}());