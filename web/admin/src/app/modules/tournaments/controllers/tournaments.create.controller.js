(function() {
  'use strict';
  
  angular
  .module('admin.tournaments')
  .controller('tournamentsCreateController', tournamentsCreateController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.tournaments.create', {
        url: '/create',
        title: 'Nuevo Tournament',
        templateUrl: 'app/modules/tournaments/views/tournaments.create.html',
        controller: 'tournamentsCreateController',
        controllerAs: 'tournamentsCtrl'
      });
  });
  
  function tournamentsCreateController($state, $timeout, tournaments_model, Notifier) {
    var vm = this;
    vm.tournament = {};
    vm.years = [];
    
    var i;
    var start_year = 2016;
    
    for (i = 0; i < 20; i++) {
      vm.years.push(start_year);
      start_year++;
    }
    
    vm.dates = {
      start_date_opened: false,
      end_date_opened: false
    };
    
    vm.altInputFormats = ['M!/d!/yyyy'];
    
    vm.get_tournaments = function() {
      if (!vm.tournament.year) {
        Notifier.warning({custom_message: 'Select a year'});
        return;
      }
      
      vm.tournaments = [];
      tournaments_model.get_tournaments_from_fantasy({year: vm.tournament.year}).then(function(data) {
        console.log(data, '-----------');
        vm.tournaments = data;
      });
    };
    
    vm.open_search_calendar = function(number) {
      
      switch (number) {
        case 1:
            vm.dates.start_date_opened = true;
            vm.dates.end_date_opened = false;
          break;
        case 2:
            vm.dates.start_date_opened = false;
            vm.dates.end_date_opened = true;
          break;
      }
    };
    
    vm.open_select_main_photo = function() {
      $timeout(function() {
        angular.element('#tournament_main_photo').trigger('click');
      }, 100);
    };
    
    vm.on_change_select_main_photo = function(files) {
      if (angular.isUndefined(files[0])) {
        return;
      }
      
      var file_extension = files[0].name.split(".").pop();
      
      if (!is_valid_file_extension(file_extension)) {
        Notifier.warning({custom_message: "Supported formats: JPG and PNG."});
        vm.main_photo_file = null;
        return true;
      }
    };
    
    vm.open_select_secondary_photo = function() {
      $timeout(function() {
        angular.element('#tournament_secondary_photo').trigger('click');
      }, 100);
    };
    
    vm.on_change_select_secondary_photo = function(files) {
      if (angular.isUndefined(files[0])) {
        return;
      }
      
      var file_extension = files[0].name.split(".").pop();
      
      if (!is_valid_file_extension(file_extension)) {
        Notifier.warning({custom_message: "Supported formats: JPG and PNG."});
        vm.secondary_photo_file = null;
        return true;
      }
    };
    
    function is_valid_file_extension(extension) {
      var is_valid_extension = false;
      
      switch (extension.toLowerCase()) {
        case 'jpg':
          is_valid_extension = true;
          break;
        case 'png':
          is_valid_extension = true;
          break;
      }
      
      return is_valid_extension;
    }
  }
})();