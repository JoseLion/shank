(function() {
  'use strict';
  
  angular.module('admin.promotions')
  .controller('promotionListController', promotionListController)
  .config(function($stateProvider) {
    $stateProvider
      .state('admin.promotions.list', {
        url: '/list',
        title: 'Lista de Promociones',
        templateUrl: 'app/modules/promotions/views/promotions.list.html',
        controller: 'promotionListController',
        controllerAs: 'promotionCtrl',
        resolve: {
          promotions: function(promotions_model) {
            return promotions_model.get();
          }
        }
      });
  });
  
  function promotionListController($state, promotions_model, promotions, NgTableParams, _) {
    var vm = this;    
    
    vm.promotions = promotions;   
    
    parse_view_data();    
    
    function parse_view_data() {
      var description;
      
      _.each(vm.promotions, function(promotion) {
        
        description = '';
        
        _.each(promotion.categories, function(category) {
          if (description !== '') {
            description += ', ';
          }
          description += category.name;
        });
        
        promotion.categories_description = description;
        
        
        description = '';
        _.each(promotion.brands, function(brand) {
          if (description !== '') {
            description += ', ';
          }
          
          description += brand.name;
        });
        
        promotion.brands_description = description;
        
        description = "";
        
        if (promotion.specifications) {
          
          if (promotion.specifications.rin) {
            description = 'R' + promotion.specifications.rin;
          }
          
          if (promotion.specifications.width && promotion.specifications.high) {
            description = promotion.specifications.width + '/' + promotion.specifications.high + description;
          }
          else if (promotion.specifications.width) {
            description = promotion.specifications.width + description;
          }
          else if (promotion.specifications.high) {
            description = promotion.specifications.high + description;
          }
        }
        
        promotion.specifications_description = description;
      });
    }
    
    //pagination
    set_promotions_pagination();
    
    function set_promotions_pagination() {
      vm.promotionsTableParams = new NgTableParams({
      }, {
        dataset: vm.promotions
      });
    }
    
    //for crud    
    vm.edit_promotion = function(promotion) {
      $state.go('admin.promotions.update', { _id: promotion._id });
    };
    
    vm.remove_promotion = function(promotion) {
      vm.close_remove_promotion_modal = false;
      vm.promotion = promotion;
    };
    
    vm.delete_promotion = function() {
      vm.close_remove_promotion_modal = true;
      promotions_model.remove(vm.promotion).then(function() {
        var index = vm.promotions.indexOf(vm.promotion);
        vm.promotions.splice(index,1);
        set_promotions_pagination();
      });
    };
  }
})();