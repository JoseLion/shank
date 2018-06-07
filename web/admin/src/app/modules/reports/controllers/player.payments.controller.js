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
          players: function(reports_model) {
            return reports_model.get_player_payments();
          }
        }
      });
  });
  
  function playerPaymentsController(NgTableParams, players, reports_model, date_utils, XLSX) {
    var vm = this;
    vm.players = players;
    
    vm.search_params = {};
    vm.dates = {
      from_date_opened: false,
      to_date_opened: false
    };
    
    parse_players();
    
    function parse_players() {
      vm.players.map(function(player) {
        player.old_players_list = '';
        player.current_players_list = '';
        
        player.old_players.map(function(old_player) {
          if (player.old_players_list !== '') {
            player.old_players_list += ', ';
          }
          
          player.old_players_list += old_player;
        });
        
        player.current_players.map(function(current_player) {
          if (player.current_players_list !== '') {
            player.current_players_list += ', ';
          }
          
          player.current_players_list += current_player;
        });
      });
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
        vm.players = response;
        parse_players();
        set_pagination();
      });
    }
    
    vm.get_player_payments_xlsx = function() {
      var data = [];
      
      if (vm.players && vm.players.length === 0) {
        return;
      }
      
      vm.players.map(function(player) {
        data.push({
          Date: date_utils.format_date(player.created_at),
          Tournament: player.tournament,
          Group: player.group,
          User: player.user_name,
          Round: player.round,
          Value: player.amount,
          'Old Players': player.old_players_list,
          'Current Players': player.current_players_list
        });
      });
      
      var ws = XLSX.utils.json_to_sheet(data);
      
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Payments");
      
      XLSX.writeFile(wb, "player-payments.xlsx");
    }
  }
})();