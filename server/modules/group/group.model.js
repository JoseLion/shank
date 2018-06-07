import mongoose from 'mongoose';
import date_service from '../services/date.services';

const GroupSchema = new mongoose.Schema({
	enabled: {type: Boolean, default: true},
	owner: {type: mongoose.Schema.Types.ObjectId, ref: 'App_User'},
	name: String,
	bet: String,
	photo: {type: mongoose.Schema.Types.ObjectId, ref: 'Archive'},
	tournaments: [{
		tournament: {type: mongoose.Schema.Types.ObjectId, ref: 'Tournament'},
		leaderboard: [{
			user: {type: mongoose.Schema.Types.ObjectId, ref: 'App_User'},
			score: {type: Number, default: 0},
			rank: {type: Number, default: 0},
			roaster: [{type: mongoose.Schema.Types.ObjectId, ref: 'Leaderboard'}],
			date_first_roaster: {type: Number},
			lastRoaster: [{type: mongoose.Schema.Types.ObjectId, ref: 'Leaderboard'}],
			checkouts: [{
				originalRoaster: [{type: mongoose.Schema.Types.ObjectId, ref: 'Leaderboard'}],
				roaster: [{type: mongoose.Schema.Types.ObjectId, ref: 'Leaderboard'}],
				round: {type: Number, default: 0},
				payment: {type: Number, default: 0},
				movements: {type: Number, default: 0},
				payment_date: {type: Number, default: date_service.utc_unix_current_date()}
			}]
		}]
	}],
	created_at: {type: Number, default: date_service.utc_unix_current_date()},
	updated_at: Number
}, {
	collection: 'groups'
});

GroupSchema.pre('save', function(next) {
	this.name = this.name.trim();
	this.bet = this.bet.trim();
	
	this.updated_at = date_service.utc_unix_current_date();
	next();
});

mongoose.model('Group', GroupSchema);