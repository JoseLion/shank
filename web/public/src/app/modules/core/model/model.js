(function() {
  
  'use strict';
  
  angular.module('core.model')
  .factory('base_model', function($http, $q, $document, $rootScope, ApiHost, Notifier, _) {
  
    var method_map = {
      get: 'get',
      post: 'create',
      put: 'update',
      delete: 'remove'
    };
  
    var handle_errors = function(method, element) {
      return function(response) {
        //$rootScope.spinner.off();
        
        if (!response.data.error) {
          return response.data.response;
        }
        
        Notifier.error({action: method_map[method], element: element, problems: response.data.error, custom_message: response.data.error});
        return $q.reject(response.data.errors);
      };
    };
    
    function request_multipart(method, resource, params) {
      var path = ApiHost + resource;
      
      //var req = {
      //    method: method,
      //    url: path,
      //    headers: {
      //      'Content-Type': undefined
      //    },
      //    enctype: 'multipart/form-data',
      //    data: params,
      //    transformRequest: angular.identity
      //};
      //
      //return $http(req)
      //.then(handle_errors(method, resource));
    }
    
    function request(method, resource, params) {
      var path = ApiHost + resource;
      //var path = 'api/' + resource;
      //$rootScope.spinner.on();
      return $http[method](path, params)
      .then(handle_errors(method, resource));
    }
    
    return function(resource) {
      
      return {
  
        get: function(params) {
          var _resource = params ? resource + '/' + params : resource;
          return request('get', _resource);
        },
        
        create: function(params) {
          return request('post', resource, params);
        },
        
        update: function(params) {
          return request('put', resource + '/' + params._id, params);
        },
        
        remove: function(params) {
          return request('delete', resource + '/' + params._id);
        },
        
        get_one: function(params) {
          return this.get(params).then(function(elements) {
            if (!_(elements).isEmpty()) {
              return elements[0];
            }
            
            return [];
          });
        },
        
        multipart: function(params) {
          return request_multipart('post', resource, params);
        }
      };
    };
  });
}());