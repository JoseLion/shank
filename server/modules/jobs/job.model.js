import mongoose, { model } from 'mongoose';

const JobSchema = new mongoose.Schema({
    cronTime: String,
    onTick: String
}, {
    collection: 'jobs',
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

mongoose.model('Job', JobSchema);