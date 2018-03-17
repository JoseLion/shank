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
			points: Number
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
	if (this.status == null) {
		this.status = true;
	}

	this.name = this.name.trim();
	this.bet = this.bet.trim();
	next();
});

mongoose.model('Group', GroupSchema);