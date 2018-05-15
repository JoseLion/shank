import mongoose from 'mongoose';
import express from 'express';
import auth from '../../config/auth';
import handleMongoError from '../../service/handleMongoError';
import multer from 'multer';

//DELETE AFTER TEST
import AssignPoints from '../../service/assignPoints';

const Group = mongoose.model('Group');
const Archive = mongoose.model('Archive');
const App_User = mongoose.model('App_User');
const basePath = '/group';
const router = express.Router();

export default function(app) {
	router.get(`${basePath}/findMyGroups`, auth, async (request, response) => {
		const groups = await Group.find({enabled: true, 'tournaments.leaderboard.user': request.payload._id}).populate('tournaments.tournament').catch(handleMongoError);
		response.ok(groups);
	});

	router.post(`${basePath}/create`, auth, multer().single('file'), async (request, response) => {
		let group = JSON.parse(request.body.group);
		let owner = await App_User.findOne({_id: request.payload._id}).catch(handleMongoError);
		let archive = await Archive.create({
			name: request.file.originalname,
			type: request.file.mimetype,
			size: request.file.size,
			data: request.file.buffer
		}).catch(handleMongoError);

		group.owner = owner;
		group.tournaments[0].leaderboard = [{user: owner, rank: 1}];
		group.photo = archive;
		group = await Group.create(group).catch(handleMongoError);
		
		if (!group) {
			response.server_error();
		}

		response.ok(group);
	});

	router.get(`${basePath}/findOne/:id`, auth, async (request, response) => {
		const group = await Group.findOne({_id: request.params.id})
			.populate('tournaments.tournament')
			.populate('tournaments.leaderboard.user')
			.populate({path: 'tournaments.leaderboard.roaster', populate: {path: 'player'}})
		.catch(handleMongoError);
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

	router.get(`${basePath}/addUserToGroup/:id`, auth, async (request, response) => {
		let user = await App_User.findOne({_id: request.payload._id}).catch(handleMongoError);
		let group = await Group.findOne({_id: request.params.id}).catch(handleMongoError);

		if (group != null) {
			group.tournaments.forEach(tournament => {
				const rank = tournament.leaderboard.length + 1;
				tournament.leaderboard.push({ user, rank });
			});

			await group.save().catch(handleMongoError);
			const userGroups = await Group.find({enabled: true, 'tournaments.leaderboard.user': request.payload._id}).populate('tournaments.tournament').catch(handleMongoError);

			response.ok(userGroups);
		} else {
			response.server_error("Sorry! The group could not be found...");
		}
	});

	router.delete(`${basePath}/delete/:id`, async (request, response) => {
		const group = await Group.findOne({_id: request.params.id}).catch(handleMongoError);
		await Archive.findOneAndRemove({_id: group.photo}).catch(handleMongoError);
		await group.remove().catch(handleMongoError);
		response.ok();
	});

	router.post(`${basePath}/updateMyRoaster/:groupId/:tournamentId`, auth, async (request, response) => {
		let group = await Group.findById(request.params.groupId).catch(handleMongoError);

		group.tournaments.forEach(cross => {
			if (cross.tournament == request.params.tournamentId) {
				cross.leaderboard.forEach(obj => {
					if (obj.user == request.payload._id) {
						obj.roaster = request.body.roaster;

						if (request.body.movements > 0) {
							obj.checkouts.push(request.body);
						}
					}
				});
			}
		});

		group = await group.save().catch(handleMongoError);
		group = await Group.findOne({_id: group._id})
			.populate('tournaments.tournament')
			.populate('tournaments.leaderboard.user')
			.populate({path: 'tournaments.leaderboard.roaster', populate: {path: 'player'}})
		.catch(handleMongoError);
		response.ok(group);
	});

	/* TESTING - DELETE AFTER */
	router.get(`${basePath}/assignPoints/:tournamentID/:round`, async (request, response) => {
		const Tournament = mongoose.model('Tournament');
		let tournament = await Tournament.findOne({tournamentID: parseInt(request.params.tournamentID)}).catch(handleMongoError);
		AssignPoints(tournament._id, request.params.round);
		response.ok();
	});

	return router;
}