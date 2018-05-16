import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    cronTime: String,
    onTick: String
});