import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
	status: {type: Boolean, default: true},
	playerID: Number,
	firstName: String,
	lastName: String,
	photoUrl: String,
}, {
	collection: 'players',
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

mongoose.model('Player', PlayerSchema);