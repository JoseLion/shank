import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
	enabled: {type: Boolean, default: true},
	playerID: Number,
	firstName: String,
	lastName: String,
    photoUrl: String,
    pickCount: {type: Number, default: 0}
}, {
	collection: 'players',
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

mongoose.model('Player', PlayerSchema);