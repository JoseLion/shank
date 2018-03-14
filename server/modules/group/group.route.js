import mongoose from 'mongoose';
import express from 'express';
import auth from '../../config/auth';

const Group = mongoose.model('Group');
const basePath = '/group';
const router = express.Router();

export default function(app) {
	router.post(`${basePath}/create`, auth, (request, response) => {
		
	});

	return router;
}