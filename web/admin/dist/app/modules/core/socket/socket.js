(function() {
  'use strict';
  
  angular.module('core')
  .factory('socket', function(Host) {
    var socket = io.connect(Host);
    
    return {
      on: function(eventName, callback){
        socket.on(eventName, callback);
      },
      emit: function(eventName, data) {
        socket.emit(eventName, data);
      }
    };
  });
})();