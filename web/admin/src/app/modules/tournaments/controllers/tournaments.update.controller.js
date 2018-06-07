(function() {
  'use strict';
  
  angular
  .module('admin.tournaments')
  .controller('tournamentsUpdateController', tournamentsUpdateController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.tournaments.update', {
        url: '/update/:_id',
        title: 'Edit Tournament',
        templateUrl: 'app/modules/tournaments/views/tournaments.update.html',
        controller: 'tournamentsUpdateController',
        controllerAs: 'tournamentsCtrl',
        resolve: {
          tournament: function(tournaments_model, $stateParams) {
            return tournaments_model.get($stateParams._id);
          }
        }
      });
  });
  
  function tournamentsUpdateController($state, $timeout, tournaments_model, tournament, date_utils, Notifier, moment, _) {
    var vm = this;
    vm.tournament = tournament;
    vm.dates = {
      start_date_opened: false,
      end_date_opened: false
    };
    
    vm.years = [];
    var tournament_selected;
    
    var i;
    var start_year = 2016;
    
    for (i = 0; i < 20; i++) {
      vm.years.push(String(start_year));
      start_year++;
    }
    
    parse_tournament();
    
    function parse_tournament() {
      vm.tournament.start_date = moment(moment.utc(vm.tournament.startDate).tz(vm.tournament.timeZone).format("YYYY-MM-DD HH:mm")).format('x') * 1;
      vm.tournament.end_date = moment(moment.utc(vm.tournament.endDate).tz(vm.tournament.timeZone).format("YYYY-MM-DD HH:mm")).format('x') * 1;
      
      var start_date_time =  moment.utc(vm.tournament.startDate).tz(vm.tournament.timeZone).format("HH:mm");
      vm.tournament.start_date_time = start_date_time;
      
      var end_date_time =  moment.utc(vm.tournament.endDate).tz(vm.tournament.timeZone).format("HH:mm");
      vm.tournament.end_date_time = end_date_time;
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
    
    vm.get_tournaments();
    
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
      var tournament_selected = _.findWhere(vm.tournaments, {tournamentID: vm.tournament.tournamentID});
      if (!tournament_selected) {
        Notifier.warning({custom_message: 'Tournament not found.'});
        return;
      }
      
      tournaments_model.update_tournament(prepare_data()).then(function() {
        Notifier.success({custom_message: 'Tournament updated.'});
        $state.go('admin.tournaments.list');
      });
    };
    
    function prepare_data() {
      var start_date = date_utils.format_date(vm.tournament.start_date);
      var end_date = date_utils.format_date(vm.tournament.end_date);
      
      vm.tournament.startDate = moment.tz(start_date + ' ' + vm.tournament.start_date_time, vm.tournament.timeZone).utc().format('x');
      vm.tournament.endDate = moment.tz(end_date + ' ' + vm.tournament.end_date_time, vm.tournament.timeZone).utc().format('x');
      
      return Object.assign(vm.tournament, {file1: vm.main_photo_file, file2: vm.secondary_photo_file});
    }
  }
})();