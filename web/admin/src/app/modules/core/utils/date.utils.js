(function() {
  'use strict';
  
  angular.module('core.utils').factory('date_utils', function(moment) {
    
    function format_date(date, format) {
      format = format || 'YYYY-MM-DD';
      return date.format(format);
    }
    
    function initial_report_date(format) {
      
      var start_date = moment().add('months', -1);
      var end_date = moment();
      
      return {start_date: format_date(start_date, format), end_date: format_date(end_date, format)};
    }
    
    function date_diff_days(date1, date2) {
      return moment(date1).diff(moment(date2), 'days');
    }
    
    function date_diff_milliseconds(date1, date2) {
      return moment.duration(moment(date1).diff(moment(date2))).asMilliseconds();
    }
    
    function add_days(date, days) {
      var new_date = moment(date).add(days, 'days');
      return new_date;
    }
    
    function to_utc_unix(date) {
      var _date = date.split(" ");
      var arr_date = _date[0].split("-");
      var arr_time = _date[1].split(":");
      
      var year = arr_date[0] ? Number(arr_date[0]) : 1970;
      var month = arr_date[1] ? (Number(arr_date[1]) - 1) : 0;
      var day = arr_date[2] ? Number(arr_date[2]) : 1;
      var hours = arr_time[0] ? Number(arr_time[0]) : 0;
      var minutes = arr_time[1] ? Number(arr_time[1]) : 0;
      var seconds = arr_time[2] ? Number(arr_time[2]) : 0;
      
      return new Date(Date.UTC(year, month, day, hours, minutes, seconds)).getTime();
    }
    
    return {
      current_date: function(format) {
        return format_date(moment(), format);
      },
      format_date: function(date, format) {
        return format_date(moment(date), format);
      },
      initial_report_date: function(format) {
        return initial_report_date(format);
      },
      date_diff_days: function(date1, date2) {
        return date_diff_days(date1, date2);
      },
      date_diff_milliseconds: function(date1, date2) {
        return date_diff_milliseconds(date1, date2);
      },
      add_days: function(date1, days) {
        return add_days(date1, days);
      },
      to_utc_unix: function(date) {
        return to_utc_unix(date);
      }
    };
  });
})();