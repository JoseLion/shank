import mongoose from 'mongoose';

let TournamentSchema = new mongoose.Schema({
	status: {type: Boolean, default: true},
	tournamentID: Number,
	name: String,
	startDate: Number,
	endDate: Number,
	isOver: Boolean,
	isInProgress: Boolean,
	canceled: Boolean,
	covered: Boolean,
	venue: String,
	location: String,
	url: String,
	year: String,
	rounds: [{
		roundID: Number,
		number: Number,
		day: Date,
		pointsGiven: {type: Boolean, default: false}
	}],
	mainPhoto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Archive'
	},
	secondaryPhoto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Archive'
	}
}, {
	collection: 'tournaments',
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

mongoose.model('Tournament', TournamentSchema);