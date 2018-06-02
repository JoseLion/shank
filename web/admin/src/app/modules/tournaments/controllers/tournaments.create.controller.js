(function() {
  'use strict';
  
  angular
  .module('admin.tournaments')
  .controller('tournamentsCreateController', tournamentsCreateController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.tournaments.create', {
        url: '/create',
        title: 'Create Tournament',
        templateUrl: 'app/modules/tournaments/views/tournaments.create.html',
        controller: 'tournamentsCreateController',
        controllerAs: 'tournamentsCtrl'
      });
  });
  
  function tournamentsCreateController($scope, $state, $timeout, tournaments_model, date_utils, Notifier) {
    var vm = this;
    vm.tournament = {};
    vm.dates = {
      start_date_opened: false,
      end_date_opened: false
    };
    
    vm.years = [];
    var tournament_selected;
    
    var i;
    var start_year = 2016;
    
    for (i = 0; i < 20; i++) {
      vm.years.push(start_year);
      start_year++;
    }
    
    vm.get_tournaments = function() {
      if (!vm.tournament.year) {
        Notifier.warning({custom_message: 'Select a year'});
        return;
      }
      
      vm.tournaments = [];
      tournaments_model.get_tournaments_from_fantasy({year: vm.tournament.year}).then(function(data) {
        vm.tournaments = data;
      });
    };
    
    vm.assign_tournament_selected = function() {
      if (vm.tournament.tournamentID) {
        tournament_selected = _.findWhere(vm.tournaments, {tournamentID: vm.tournament.tournamentID});
        tournament_selected.start_date = moment(tournament_selected.startDate).format('x') * 1;
        tournament_selected.end_date = moment(tournament_selected.endDate).format('x') * 1;
        tournament_selected.timeZone = tournament_selected.timeZone.split(' ').join('_');
        
        vm.tournament = Object.assign(vm.tournament, tournament_selected);
      }
    };
    
    vm.open_calendar = function(number) {
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
    
    vm.save = function() {
      //var form_data = new FormData();
      
      //form_data.append('tournament', vm.tournament);
      //form_data.append('file1', vm.main_photo_file);
      //form_data.append('file2', vm.secondary_photo_file);
      
      if (!is_valid_data()) {
        return;
      }
      
      if (!tournament_selected) {
        Notifier.warning({custom_message: 'Tournament not found.'});
        return;
      }
      
      tournaments_model.create_tournament(prepare_data(tournament_selected)).then(function() {
        Notifier.success({custom_message: 'Tournament created.'});
        $state.go('admin.tournaments.list');
      });
    };
    
    function is_valid_data() {
      if (!vm.main_photo_file) {
        Notifier.warning({custom_message: 'Select a main photo.'});
        return false;
      }
      
      if (!vm.secondary_photo_file) {
        Notifier.warning({custom_message: 'Select a secondary photo.'});
        return false;
      }
      
      return true;
    }
    
    function prepare_data() {
      var start_date = date_utils.format_date(vm.tournament.start_date);
      var end_date = date_utils.format_date(vm.tournament.end_date);
      
      vm.tournament.startDate = moment.tz(start_date + ' ' + vm.tournament.start_date_time, vm.tournament.timeZone).utc().format('x');
      vm.tournament.endDate = moment.tz(end_date + ' ' + vm.tournament.end_date_time, vm.tournament.timeZone).utc().format('x');
      
      return Object.assign(vm.tournament, {file1: vm.main_photo_file, file2: vm.secondary_photo_file});
    }
  }
})();