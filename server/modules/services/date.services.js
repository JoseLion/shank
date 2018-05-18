import moment from 'moment-timezone';

export default {
	utc_unix_current_date: function() {
		return moment().format('x') * 1;
	}
}