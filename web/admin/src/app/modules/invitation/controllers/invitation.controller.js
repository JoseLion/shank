(function() {
  'use strict';
  
  angular
  .module('public.invitation')
  .controller('InvitationController', InvitationController)
  .config(function($stateProvider) {
    $stateProvider
      .state('invitation', {
        url: '/invitation?group',
        title: 'Invitation',
        templateUrl: 'app/modules/invitation/views/invitation.html',
        controller: 'InvitationController',
        controllerAs: 'invitationCtrl'
      });
  });
  
  function InvitationController($stateParams) {
    var vm = this;
    
    vm.open_app = function() {
      if ($stateParams.group) {
        window.location.href = 'comelevisionshank://group=' + $stateParams.group;
      }
    };

    vm.open_android = function() {
      window.location.href = 'market://details?id=com.elevision.shank';
    };
    
    vm.open_ios = function() {
      window.location.href = 'market://details?id=com.elevision.shank';
    };
  }
})();