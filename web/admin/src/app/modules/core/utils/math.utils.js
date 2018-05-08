/* global Big */
'use strict';

angular.module('core.utils').factory('math_utils', function(_) {

  // System decimal places
  var default_decimal_places = 2;

  function any_argument_null(args){
    return _.contains(args, null);
  }
  
  return {
    add: function() {
      var args = _.toArray(arguments);
      if (any_argument_null(args) || args.length === 0) { return null; }

      function cback(accum, curr) { return accum.plus(curr); }
      
      return Number(_.reduce(args, cback, new Big(0)));
    },

    subtract: function() {
      var args = _.toArray(arguments);
      if (any_argument_null(args) || args.length === 0) { return null; }

      var first = args[0];
      //delete args[0];
      args.shift();

      function cback(accum, curr) { return accum.minus(curr); }
      
      return Number(_.reduce(args, cback, new Big(first)));
    },

    multiply: function() {
      var args = _.toArray(arguments);
      if(any_argument_null(args) || args.length === 0){ return null; }

      function cback(accum, curr) { return accum.times(curr); }

      return Number(_.reduce(args, cback, new Big(1)));
    },

    divide: function() {
      var args = _.toArray(arguments);
      if(any_argument_null(args) || args.length === 0){ return null; }

      function cback(accum, curr) { return Big(accum).div(curr); }
      
      return Number(_.reduce(args, cback));
    },
    
    percentage: function() {
      
      var that = this;
      
      var args = _.toArray(arguments);
      if(any_argument_null(args) || args.length === 0){ return null; }
      
      function cback(accum, curr) {
        
        if (accum < curr) {
          return 0;
        }
        
        return that.divide(that.multiply(curr, 100), accum);
      }
      
      return Number(_.reduce(args, cback));
    },

    average: function(collection) {
      var that = this;
      if(any_argument_null(collection) || collection.length === 0) {
        return null;
      }
      var sum = _(collection).reduce(function(acum, num) { return that.add(acum, num); }, 0);
      
      return this.divide(sum, _.size(collection));
    },

    weighted_average: function(collection) {
      var that = this;
      
      if (collection.length === 0) { return null;}
      
      var added_weights = _.reduce(collection, function(acum, obj) { return that.add(acum, obj.weight); }, 0);

      return _.reduce(collection, function(average, obj) {
        return that.add(average, that.divide(that.multiply(obj.value, obj.weight), added_weights));
      }, 0);
    },
    
    truncated_average: function(collection) {
      return this.truncate(this.average(collection));
    },
    
    truncated_weighted_average: function(collection) {
      return this.truncate(this.weighted_average(collection));
    },

    truncate: function(num) {
      if (num || num===0) {
        return Number(Big(num).round(default_decimal_places, 0));
      }
      return null;
    },
    
    round: function(number, decimal_places) {
      var new_decimal_places = decimal_places || default_decimal_places;
      if (number || number === 0) {
        return Number(Big(number).round(new_decimal_places));
      }
      return null;
    }
  };
});
