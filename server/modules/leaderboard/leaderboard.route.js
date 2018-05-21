import mongoose from 'mongoose';
import express from 'express';
import auth from '../../config/auth';
import handleMongoError from '../../service/handleMongoError';

const Leaderboard = mongoose.model('Leaderboard');
const basePath = '/leaderboard';
const router = express.Router();
let leaderboard_service = require('./leaderboard.service');

export default function(app) {
	router.get(`${basePath}/findByTournament/:id`, auth, async (request, response) => {
		const leaderboard = await Leaderboard.find({tournament: request.params.id}).sort({rank: 1}).populate('player').catch(handleMongoError);
		response.ok(leaderboard);
	});
	
	router.post('/load_leaderboard', leaderboard_service.load_leaderboard);

	return router;
}