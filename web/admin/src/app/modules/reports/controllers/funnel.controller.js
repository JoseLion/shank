(function() {
  'use strict';
  
  angular
  .module('admin.reports')
  .controller('reportFunnelController', reportFunnelController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.reports.funnel', {
        url: '/funnel',
        title: 'Funnel',
        templateUrl: 'app/modules/reports/views/funnel.html',
        controller: 'reportFunnelController',
        controllerAs: 'reportFunnelCtrl',
        resolve: {
          funnel: function(reports_model) {
            return reports_model.get_funnel();
          }
        }
      });
  });
  
  function reportFunnelController(funnel, reports_model) {
    var vm = this;
    vm.funnel = funnel;
    display_chart();
    
    function display_chart() {
      var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2", //"light1", "dark1", "dark2"
        title:{
          text: "Funnel"
        },
        data: [{
          type: "funnel",
          indexLabelPlacement: "inside",
          indexLabelFontColor: "white",
          toolTipContent: "<b>{label}</b>: {y}",
          indexLabel: "{label} ({y})",
          //neckWidth: 20,
          //neckHeight: 0,
          //valueRepresents: "area",
          dataPoints: [
            { y: vm.funnel.acquisition, label: "Acquisition" },
            { y: vm.funnel.activation, label: "Activation" },
            { y: vm.funnel.referral,  label: "Referral" },
            { y: vm.funnel.revenue, label: "Revenue" }
          ]
        }]
      });
      
      calculatePercentage(chart);
      chart.render();
    }
    
    function calculatePercentage(chart) {
      var dataPoint = chart.options.data[0].dataPoints;
      for(var i = 0; i < dataPoint.length; i++) {
        //console.log(chart.options.data[0].dataPoints[i], 'chart.options.data[0].dataPoints[i]');
        if(i === 0) {
          chart.options.data[0].dataPoints[i].percentage = dataPoint[i].y;
        } else {
          //chart.options.data[0].dataPoints[i].percentage = ((dataPoint[i].y / total) * 100).toFixed(2);
        }
      }
    }
    
    vm.search_params = {};
    vm.dates = {
      from_date_opened: false,
      to_date_opened: false
    };
    
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
        
    vm.find_funnel = function() {
      var vm_search_params = angular.copy(vm.search_params);
      
      if (vm_search_params.from_date && vm_search_params.to_date) {
        vm_search_params.from_date = date_utils.format_date(vm_search_params.from_date);
        vm_search_params.to_date = date_utils.format_date(vm_search_params.to_date);
      }
      
      reports_model.get_funnel(vm_search_params).then(function(response) {
        vm.funnel = response;
        display_chart();
      });
    }
  }
})();