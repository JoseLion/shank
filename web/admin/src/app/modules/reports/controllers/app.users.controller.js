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
      
      if (vm_search_params.from_date && vm_search_params.to_date) {
        vm_search_params.from_date = date_utils.format_date(vm_search_params.from_date);
        vm_search_params.to_date = date_utils.format_date(vm_search_params.to_date);
      }
      else {
        delete vm_search_params.from_date;
        delete vm_search_params.to_date;
      }
      
      reports_model.get_app_users(vm_search_params).then(function(response) {
        vm.app_users = response;
        parse_app_users();
        set_pagination();
      });
    }
    
    vm.get_users_xlsx = function() {
      /* starting from this data */
      var data = [];
      
      vm.app_users.map(function(app_user) {
        data.push({User: app_user.fullName, Gender: app_user.gender, Country: app_user.country, Chanel: app_user.channel, 'Register date': date_utils.format_date(app_user.created_at)});
      });
      
      /* generate a worksheet */
      var ws = XLSX.utils.json_to_sheet(data);
      
      /* add to workbook */
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "App users");
      
      /* write workbook and force a download */
      XLSX.writeFile(wb, "app-users.xlsx");
    }
  }
})();