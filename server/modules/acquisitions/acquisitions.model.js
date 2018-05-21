let mongoose = require('mongoose');
import date_service from '../services/date.services';

let AcquisitionSchema = new mongoose.Schema({
	client_ip: {type: String, unique: true, required: true, index: true},
  user_agent: String,
	created_at: Number,
	updated_at: Number
});

AcquisitionSchema.pre('save', function(next) {
	if (!this.created_at) {
		this.created_at = date_service.utc_unix_current_date();
	}
	this.updated_at = date_service.utc_unix_current_date();
	next();
});

mongoose.model('Acquisition', AcquisitionSchema);