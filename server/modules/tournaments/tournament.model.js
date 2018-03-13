let mongoose = require('mongoose');

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
		day: Date
	}]
}, {
	timestamps: {
		creationDate: 'creationDate',
		updateDate: 'updateDate'
	}
});

mongoose.model('Tournament', TournamentSchema);