import mongoose from 'mongoose';

let ReferredSchema = new mongoose.Schema({
	host: {
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
	created_at: Number,
	updated_at: Number
}, {
	collection: 'referrals'
});

ReferredSchema.pre('save', function(next) {
	if (!this.created_at) {
		this.created_at = date_service.utc_unix_current_date();
	}
	this.updated_at = date_service.utc_unix_current_date();
	next();
});

mongoose.model('Referred', ReferredSchema);