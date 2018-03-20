import mongoose from 'mongoose';

const LeaderboardSchema = new mongoose.Schema({
	status: {type: Boolean, default: true},
	playerTournamentID: Number,
	tournament: {type: mongoose.Schema.Types.ObjectId, ref: 'Tournament'},
	player: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'},
	rank: Number,
	totalScore: Number,
	rounds: [{
		number: Number,
		score: Number
	}]
}, {
	collection: 'leaderboards',
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

mongoose.model('Leaderboard', LeaderboardSchema);