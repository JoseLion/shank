import moment from 'moment-timezone';

export default {
	utc_unix_current_date: function() {
		return moment().utc().unix();
	}
}