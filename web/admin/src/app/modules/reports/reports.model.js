(function() {
  'use strict';
  
  angular.module('admin.reports').factory('reports_model', function(base_model) {
    var model = base_model('reports');
    
    model.get_earnings = function(params) {
      return base_model('get_earnings').create(params);
    }
    
    model.get_earnings_xlsx = function(params) {
      return base_model('get_earnings_xlsx').create(params);
    }
    
    model.get_funnel = function(params) {
      return base_model('get_funnel').create(params);
    }
    
    model.get_app_users = function(params) {
      return base_model('get_app_users').create(params);
    }
    
    model.get_ranking_by_tournament = function(params) {
      return base_model('get_ranking_by_tournament').create(params);
    }
    
    model.get_referrals = function(params) {
      return base_model('get_referrals').create(params);
    }
    
    return model;
  });
})();