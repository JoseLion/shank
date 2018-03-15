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
		let tournaments = await Tournament.find({}).catch(handleMongoError);
		response.ok(tournaments)
	});

	router.get(`${basePath}/updateTournaments`, auth, async (request, response) => {
		let tournaments = await fantasy.updateTournaments();
		response.ok(tournaments);
	});

	return router;
}