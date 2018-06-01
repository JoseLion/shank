(function() {
  'use strict';
  
  angular
  .module('admin.reports')
  .controller('playerPaymentsController', playerPaymentsController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.reports.player_payments', {
        url: '/player-payments',
        title: 'Playe Payments',
        templateUrl: 'app/modules/reports/views/player.payments.html',
        controller: 'playerPaymentsController',
        controllerAs: 'playerPaymentCtrl',
        resolve: {
          groups: function(reports_model) {
            return reports_model.get_player_payments();
          }
        }
      });
  });
  
  function playerPaymentsController(NgTableParams, groups, reports_model, date_utils) {
    var vm = this;
    var players = [];
    
    vm.search_params = {};
    vm.dates = {
      from_date_opened: false,
      to_date_opened: false
    };
    
    parse_groups(groups);
    
    function parse_groups(groups) {
      groups.map(function(group) {
        group.tournaments.map(function(tournament) {
          tournament.leaderboard.map(function(leaderboard) {
            if (leaderboard.checkouts.length > 0) {
              leaderboard.checkouts.map(function(checkout) {
                players.push({
                  tournament: tournament.tournament.name,
                  group: group.name,
                  user_name: leaderboard.user.fullName,
                  round: checkout.round,
                  amount: checkout.payment,
                  payment_date: checkout.payment_date,
                  old_players: get_change_of_players(checkout.round, checkout.originalRoaster, checkout.roaster).ald_players,
                  new_players: get_change_of_players(checkout.round, checkout.originalRoaster, checkout.roaster).current_palyers
                });
              });
            }
          });
        });
      });
    }
    
    function get_change_of_players(round, old_roaster, current_roaster) {
      var ald_players = [];
      var current_palyers = [];
      
      if (round > 1 && round < 5) {
        var number = old_roaster.length;
        
        if (number > 0) {
          var i;
          
          for (i = 0; i < number; i++) {
            if (old_roaster[i]._id !== current_roaster[i]._id) {
              ald_players.push(old_roaster[i].fullName);
              current_palyers.push(current_roaster[i].fullName);
            }
          }
        }
      }
      
      return {ald_players: ald_players, current_palyers: current_palyers};
    }
    
    set_pagination();
    
    function set_pagination() {
      vm.tableParams = new NgTableParams({
      }, {
        dataset: vm.players
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
    
    vm.find_player_payments = function() {
      var vm_search_params = angular.copy(vm.search_params);
      
      if (vm_search_params.from_date && vm_search_params.to_date) {
        vm_search_params.from_date = date_utils.format_date(vm_search_params.from_date);
        vm_search_params.to_date = date_utils.format_date(vm_search_params.to_date);
      }
      
      reports_model.get_player_payments(vm_search_params).then(function(response) {
        vm.app_users = response;
        parse_groups(response);
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