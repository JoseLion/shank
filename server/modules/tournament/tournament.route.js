import mongoose from 'mongoose';
import express from 'express';
import auth from '../../config/auth';
import fantasy from '../../service/fantasy';
import handleMongoError from '../../service/handleMongoError';

const Tournament = mongoose.model('Tournament');
const basePath = '/tournament'
const router = express.Router();

export default function(app) {
	router.get(`${basePath}/findAll`, auth, async (request, response) => {
		let tournaments = await Tournament.find({endDate: {$gte: new Date()}}).sort({startDate: 1}).catch(handleMongoError);
		response.ok(tournaments)
	});

	router.get(`${basePath}/updateTournaments`, auth, async (request, response) => {
		let tournaments = await fantasy.get_tournaments();
		response.ok(tournaments);
	});
	
	router.route('/get_tournaments_from_fantasy')
	.post(auth, async (req, res) => {
		console.log(req.body, '------------------');
		let tournaments = await fantasy.get_tournaments(req.body.year);
		//console.log(tournaments, 'tournaments');
		res.ok(tournaments);
	});

	return router;
}