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
  
  function playerPaymentsController(NgTableParams, players, reports_model, date_utils) {
    var vm = this;
    vm.players = players;
    
    vm.search_params = {};
    vm.dates = {
      from_date_opened: false,
      to_date_opened: false
    };
    
    parse_players();
    
    function parse_players() {
      players.map(function(player) {
        player.old_players_list = '';
        player.new_players_list = '';
        
        player.old_players.map(function(old_player) {
          if (player.old_players_list !== '') {
            player.old_players_list += ', ';
          }
          
          player.old_players_list += old_player;
        });
        
        player.new_players.map(function(new_player) {
          if (player.new_players_list !== '') {
            player.old_players_list += ', ';
          }
          
          player.old_players_list += new_player;
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