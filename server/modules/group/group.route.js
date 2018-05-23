import mongoose from 'mongoose';
import express from 'express';
import auth from '../../config/auth';
import handleMongoError from '../../service/handleMongoError';
import multer from 'multer';

//DELETE AFTER TEST
import AssignPoints from '../../service/assignPoints';
import PushNotification from '../../service/pushNotification';

const Group = mongoose.model('Group');
const Archive = mongoose.model('Archive');
const AppUser = mongoose.model('App_User');
const basePath = '/group';
const router = express.Router();

export default function(app) {
	router.get(`${basePath}/findMyGroups`, auth, async (request, response) => {
		const groups = await Group.find({enabled: true, 'tournaments.leaderboard.user': request.payload._id}).populate('tournaments.tournament').catch(handleMongoError);
		response.ok(groups);
	});

	router.post(`${basePath}/create`, auth, multer().single('file'), async (request, response) => {
		let group = JSON.parse(request.body.group);
		let owner = await AppUser.findOne({_id: request.payload._id}).catch(handleMongoError);
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

		/* --------------------------------- SHOULD BE DELETED --------------------------------- */
		const appUsers = await AppUser.find({});
		const pushNotification = new PushNotification();
		
		appUsers.asyncForEach(async appUser => {
			appUser.notifications.asyncForEach(async notifObj => {
				pushNotification.send({token: notifObj.token, os: notifObj.os, alert: `A new group named '${group.name}' was created by ${owner.fullName}`});
			});
		});
		/* -------------------------------------------------------------------------------------- */

		response.ok(group);
	});

	router.get(`${basePath}/findOne/:id`, auth, async (request, response) => {
		try {
			const group = await Group.findOne({_id: request.params.id})
									.populate('tournaments.tournament')
									.populate('tournaments.leaderboard.user')
									.populate({path: 'tournaments.leaderboard.roaster', populate: {path: 'player'}})
									.catch(handleMongoError);

			if (!group) {
				return response.reset_content("Sorry! This group has been deleted");
			}

			response.ok(group);
		} catch (error) {
			response.server_error(error);
		}
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
		try {
			let user = await AppUser.findOne({_id: request.payload._id}).catch(handleMongoError);
			let group = await Group.findOne({_id: request.params.id}).catch(handleMongoError);

			if (!group) {
				return response.reset_content("Sorry! The group could not be found...");
			}

			let isUserInGroup = false;
			group.tournaments.forEach(tournamentCross => {
				tournamentCross.leaderboard.forEach(leaderboardCross => {
					if (leaderboardCross.user === user._id) {
						isUserInGroup = true;
						return;
					}
				});

				if (isUserInGroup) {
					return;
				}
			});

			if (!isUserInGroup) {
				group.tournaments.forEach(tournament => {
					const rank = tournament.leaderboard.length + 1;
					tournament.leaderboard.push({ user, rank });
				});

				await group.save().catch(handleMongoError);
				const userGroups = await Group.find({enabled: true, 'tournaments.leaderboard.user': request.payload._id}).populate('tournaments.tournament').catch(handleMongoError);
			}

			response.ok(userGroups);
		} catch (error) {
			response.server_error(error);
		}
	});

	router.delete(`${basePath}/delete/:id`, async (request, response) => {
		const group = await Group.findOne({_id: request.params.id}).catch(handleMongoError);
		await Archive.findOneAndRemove({_id: group.photo}).catch(handleMongoError);
		await group.remove().catch(handleMongoError);
		response.ok();
	});

	router.post(`${basePath}/updateMyRoaster/:groupId/:tournamentId`, auth, async (request, response) => {
		try {
			let isUserInGroup = false;
			let group = await Group.findById(request.params.groupId).catch(handleMongoError);

			if (!group) {
				return response.reset_content("Sorry! This group has been deleted");
			}

			group.tournaments.forEach(tournamentCross => {
				if (tournamentCross.tournament == request.params.tournamentId) {
					tournamentCross.leaderboard.forEach(cross => {
						if (cross.user == request.payload._id) {
							isUserInGroup = true;
							cross.roaster = request.body.roaster;

							if (request.body.movements > 0) {
								cross.checkouts.push(request.body);
							}
						}
					});
				}
			});

			if (!isUserInGroup) {
				return response.reset_content("Sorry! You were removed from this group");
			}

			group = await group.save().catch(handleMongoError);
			group = await Group.findOne({_id: group._id})
				.populate('tournaments.tournament')
				.populate('tournaments.leaderboard.user')
				.populate({path: 'tournaments.leaderboard.roaster', populate: {path: 'player'}})
			.catch(handleMongoError);
			response.ok(group);
		} catch (error) {
			response.server_error(error);
		}
	});

	/* ----------------- THIS SOULD BE DELETED ----------------- */
	router.get(`${basePath}/assignPoints/:tournamentID/:round`, async (request, response) => {
		const Tournament = mongoose.model('Tournament');
		let tournament = await Tournament.findOne({tournamentID: parseInt(request.params.tournamentID)}).catch(handleMongoError);
		AssignPoints(tournament._id, request.params.round);
		response.ok();
	});
	/* -------------------------------------------------------- */

	return router;
}