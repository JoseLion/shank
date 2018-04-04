import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
	status: {type: Boolean, default: true},
	owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	name: String,
	bet: String,
	photo: {type: mongoose.Schema.Types.ObjectId, ref: 'Archive'},
	tournaments: [{
		tournament: {type: mongoose.Schema.Types.ObjectId, ref: 'Tournament'},
		leaderboard: [{
			user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
			score: {type: Number, default: 0},
			rank: {type: Number, default: 0},
			roaster: [{type: mongoose.Schema.Types.ObjectId, ref: 'Leaderboard'}],
			lastRoaster: [{type: mongoose.Schema.Types.ObjectId, ref: 'Leaderboard'}],
			checkouts: [{
				originalRoaster: [{type: mongoose.Schema.Types.ObjectId, ref: 'Leaderboard'}],
				roaster: [{type: mongoose.Schema.Types.ObjectId, ref: 'Leaderboard'}],
				round: {type: Number, default: 0},
				payment: {type: Number, default: 0},
				movements: {type: Number, default: 0}
			}]
		}]
	}]
}, {
	collection: 'groups',
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

GroupSchema.pre('save', function(next) {
	this.name = this.name.trim();
	this.bet = this.bet.trim();

	next();
});

mongoose.model('Group', GroupSchema);