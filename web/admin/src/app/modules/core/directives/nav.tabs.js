(function () {
  'use strict';
  
  angular.module('core.directives')
  .directive('navTabs', function(_) {
    return {
      restrict: 'AC',
      link: function(scope, element) {
        
        var panes = angular.element(element).parent('.tabbable').find('.tab-pane');
        var tabs_container = angular.element(element).parent('.tabbable');
        
  
        _.each(panes, function(pane) {
          scope.$watch(function() {
            return pane.childNodes.length;
          },
          function() {
            if(angular.element(pane).find('*').length === 0){
              var tab_link = angular.element(tabs_container).find('a[data-target="#' + angular.element(pane).attr('id')+'"]');
              tab_link.parent('li').remove();
              angular.element(pane).remove();
            }
  
            if(!angular.element(element).find('li.active').length) {
              activate_first_li();
            }
          });
        });
  
        function activate_first_li() {
          var li = angular.element(angular.element(element).find('li')[0]);
          li.addClass('in active');
          var tabbable = angular.element(element).parent('.tabbable');
          tabbable.find('.tab-pane').removeClass('active');
          var pane = tabbable.find(li.find('a').data('target'));
          pane.addClass('in active');
        }
      }
    };
  });
})();