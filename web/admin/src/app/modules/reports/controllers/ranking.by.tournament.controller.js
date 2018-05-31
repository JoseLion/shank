(function() {
  'use strict';
  
  angular
  .module('admin.reports')
  .controller('rankingByTournamentController', rankingByTournamentController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.reports.ranking_by_tournament', {
        url: '/ranking-by-tournament',
        title: 'Ranking by Tournament',
        templateUrl: 'app/modules/reports/views/ranking.by.tournament.html',
        controller: 'rankingByTournamentController',
        controllerAs: 'rankingByTournamentCtrl',
        resolve: {
          tournaments: function(tournaments_model) {
            return tournaments_model.get();
          }
        }
      });
  });
  
  function rankingByTournamentController(NgTableParams, tournaments, reports_model, _) {
    var vm = this;
    
    vm.tournaments = tournaments;
    vm.search_params = {};
    vm.rankings = [];
    
    set_pagination();
    
    function set_pagination() {
      vm.tableParams = new NgTableParams({
      }, {
        dataset: vm.rankings
      });
    }
    
    vm.find_rankings = function() {
      reports_model.get_ranking_by_tournament(vm.search_params).then(function(response) {
        prepare_data_to_display(response);
        set_pagination();
      });
    }
    
    function prepare_data_to_display(groups) {
      var new_rankings = [];
      
      _.each(groups, function(group) {
        _.each(group.tournaments, function(tournament) {
          _.each(tournament.leaderboard, function(leaderboard) {
            leaderboard.group_name = group.name;
            new_rankings.push(leaderboard);
          });
        });
      });
      
      vm.rankings = new_rankings;
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