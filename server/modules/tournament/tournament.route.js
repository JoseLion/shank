import mongoose from 'mongoose';
import express from 'express';
import auth from '../../config/auth';
import fantasy from '../../service/fantasy';

const Tournament = mongoose.model('Tournament');
const basePath = '/tournament'
const router = express.Router();

export default function(app) {
	router.get(`${basePath}/updateTournaments`, auth, async (request, response) => {
		await fantasy.updateTournaments();
		response.ok();
	});

	return router;
}