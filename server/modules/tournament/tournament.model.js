import mongoose from 'mongoose';

let TournamentSchema = new mongoose.Schema({
	status: {type: Boolean, default: true},
	tournamentID: Number,
	name: String,
	startDate: Date,
	endDate: Date,
	isOver: Boolean,
	isInProgress: Boolean,
	canceled: Boolean,
	covered: Boolean,
	rounds: [{
		roundID: Number,
		number: Number,
		day: Date,
		pointsGiven: {type: Boolean, default: false}
	}]
}, {
	collection: 'tournaments',
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

mongoose.model('Tournament', TournamentSchema);