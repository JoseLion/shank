(function() {
  'use strict';
  
  angular
  .module('admin.reports')
  .controller('appUsersController', appUsersController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.reports.app_users', {
        url: '/app-users',
        title: 'App Users',
        templateUrl: 'app/modules/reports/views/app.users.html',
        controller: 'appUsersController',
        controllerAs: 'appUserCtrl',
        resolve: {
          app_users: function(reports_model) {
            return reports_model.get_app_users();
          }
        }
      });
  });
  
  function appUsersController(NgTableParams, app_users, reports_model, date_utils, _) {
    var vm = this;
    
    vm.app_users = app_users;
    vm.search_params = {};
    vm.dates = {
      from_date_opened: false,
      to_date_opened: false
    };
    
    parse_app_users();
    
    function parse_app_users() {
      _.each(vm.app_users, function(app_user) {
        app_user.channel = 'Email';
        if (app_user.isFacebookUser) {
          app_user.channel = 'Facebook';
        }
      });
    }
    
    set_pagination();
    
    function set_pagination() {
      vm.tableParams = new NgTableParams({
      }, {
        dataset: vm.app_users
      });
    }
    
    vm.clear_search_params = function() {
      vm.search_params = {};
    }
    
    vm.open_search_calendar = function(number) {
      switch (number) {
        case 1:
          vm.dates.from_date_opened = true;
          vm.dates.to_date_opened = false;
          break;
        case 2:
          vm.dates.from_date_opened = false;
          vm.dates.to_date_opened = true;
          break;
      }
    }
    
    vm.find_app_users = function() {
      var vm_search_params = angular.copy(vm.search_params);
      console.log(vm_search_params, 'vm_search_params');
      if (vm_search_params.from_date && vm_search_params.to_date) {
        vm_search_params.from_date = date_utils.format_date(vm_search_params.from_date);
        vm_search_params.to_date = date_utils.format_date(vm_search_params.to_date);
      }
      
      reports_model.get_app_users(vm_search_params).then(function(response) {
        vm.app_users = response;
        parse_app_users();
        set_pagination();
      });
    }
    
    vm.get_app_users_xlsx = function() {
      reports_model.get_app_users_xlsx().then(function(response) {
        var file = new Blob([response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        var fileURL = URL.createObjectURL(file);
        
        var anchor = document.createElement("a");
        anchor.download = "app_users.xls";
        anchor.href = fileURL;
        document.body.appendChild(anchor);
        anchor.click();
      });
    }
  }
})();