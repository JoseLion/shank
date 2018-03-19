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
		const groups = await Group.find({status: true, owner: request.payload._id}).populate('tournaments.tournament').catch(handleMongoError);
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

		group.owner = owner;
		group.tournaments[0].leaderboard = [{user: owner}];
		group.photo = archive;
		group = await Group.create(group).catch(handleMongoError);
		
		if (!group) {
			response.serverError();
		}

		response.ok(group);
	});

	router.get(`${basePath}/findOne/:id`, auth, async (request, response) => {
		const group = await Group.findOne({_id: request.params.id}).populate('tournaments.tournament').populate('tournaments.leaderboard.user').catch(handleMongoError);
		response.ok(group);
	});

	router.get(`${basePath}/removeUserFromGroup/:userId/:groupId`, async (request, response) => {
		let group = await Group.findOne({_id: request.params.groupId}).catch(handleMongoError);

		group.tournaments.forEach(cross => {
			let index;

			cross.leaderboard.forEach((obj, i) => {
				if (obj.user == request.params.userId) {
					index = i;
					return;
				}
			});

			cross.leaderboard.splice(index, 1);
		});

		group = await group.save().catch(handleMongoError);
		response.ok(group);
	});

	return router;
}