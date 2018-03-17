import mongoose from 'mongoose';

const ArchiveSchema = new mongoose.Schema({
	name: String,
	type: String,
	size: Number,
	data: Buffer
}, {
	collection: 'archives',
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

mongoose.model('Archive', ArchiveSchema);