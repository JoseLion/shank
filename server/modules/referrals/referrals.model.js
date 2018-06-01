import mongoose from 'mongoose';
import date_service from '../services/date.services';

let ReferredSchema = new mongoose.Schema({
	user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'App_User'
	},
	guests: [
    new mongoose.Schema({
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'App_User'
      }
    })
	],
	enabled: {type: Boolean, default: true},
	created_at: {type: Number, default: date_service.utc_unix_current_date()},
	updated_at: Number
}, {
	collection: 'referrals'
});

ReferredSchema.pre('save', function(next) {
	this.updated_at = date_service.utc_unix_current_date();
	next();
});

mongoose.model('Referred', ReferredSchema);