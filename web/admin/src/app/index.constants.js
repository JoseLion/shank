/* global malarkey:false, moment:false */
(function() {
  'use strict';

  var Host = window.location.origin;
  var ApiHost = Host + "/api/";
  
  if (location.hostname === 'localhost') {
    Host = "http://localhost:3010/";
    ApiHost = Host + "api/";
  }
  
  angular
    .module('shankAdmin')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('Host', Host)
    .constant('ApiHost', ApiHost)
    .constant('XLSX', XLSX);

})();
