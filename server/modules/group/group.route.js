import mongoose from 'mongoose';
import express from 'express';
import auth from '../../config/auth';
import handleMongoError from '../../service/handleMongoError';

const Group = mongoose.model('Group');
const basePath = '/group';
const router = express.Router();

export default function(app) {
	router.post(`${basePath}/create`, auth, async (request, response) => {
		let group = await Group.create(request.body).catch(handleMongoError);
		
		if (!group) {
			response.serverError();
		}

		response.ok(group);
	});

	return router;
}