import mongoose from 'mongoose';
import express from 'express';
import auth from '../../config/auth';
import handleMongoError from '../../service/handleMongoError';
import multer from 'multer';

const Group = mongoose.model('Group');
const Archive = mongoose.model('Archive');
const User = mongoose.model('User');
const basePath = '/group';
const router = express.Router();

export default function(app) {
	router.get(`${basePath}/findMyGroups`, auth, async (request, response) => {
		const groups = await Group.find({status: true, owner: request.payload._id}).catch(handleMongoError);
		response.ok(groups);
	});

	router.post(`${basePath}/create`, auth, multer().single('file'), async (request, response) => {
		let group = JSON.parse(request.body.group);
		let owner = await User.findOne({_id: request.payload._id}).catch(handleMongoError);
		let archive = await Archive.create({
			name: request.file.originalname,
			type: request.file.mimetype,
			size: request.file.size,
			data: request.file.buffer
		}).catch(handleMongoError);

		group.owner = owner._id;
		group.photo = archive._id;
		group = await Group.create(group).catch(handleMongoError);
		
		if (!group) {
			response.serverError();
		}

		response.ok(group);
	});

	return router;
}