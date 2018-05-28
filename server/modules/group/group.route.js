import mongoose from 'mongoose';
import express from 'express';
import auth from '../../config/auth';
import handleMongoError from '../../service/handleMongoError';
import multer from 'multer';
import Q from 'q';

//DELETE AFTER TEST
import AssignPoints from '../../service/assignPoints';
import PushNotification from '../../service/pushNotification';

const Group = mongoose.model('Group');
const Archive = mongoose.model('Archive');
const AppUser = mongoose.model('App_User');
const Tournament = mongoose.model('Tournament');
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

	router.post(`${basePath}/update`, auth, multer().single('file'), async (req, res) => {
		let group = JSON.parse(req.body.group);
		try {
			let promises = [];
			let archive_id;

			if (req.file) {
				archive_id = mongoose.Types.ObjectId();

				let archive_one = new Archive({
					_id: archive_id,
					name: req.file.originalname,
					type: req.file.mimetype,
					size: req.file.size,
					data: req.file.buffer
				});

				if (group.photo) {
					promises.push(Archive.findByIdAndRemove(group.photo).exec());
				}

				promises.push(archive_one.save());
				group.photo = archive_id;
			}

			promises.push(Group.update({_id: group._id}, group).exec());

			Q.all(promises).then(() => {
				res.ok(group);
			}, (err) => {
				res.server_error(err);
			});
		} catch (error) {
			return res.server_error(error);
		}
	});

	router.post(`${basePath}/addTournament`, auth, async (req, res) => {
		try {
			let new_tournament = req.body.new_tournament;
			new_tournament.leaderboard[0].user = req.payload._id;
			
			Group.update({"_id": req.body._id}, { $push: { tournaments: new_tournament} }, function(err, group) {
				if (err) {
					return res.server_error(err);
				}

				res.ok(req.body);
			});
		} catch (error) {
			return res.server_error(error);
		}
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
					if (String(leaderboardCross.user) === String(user._id)) {
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
				response.ok(userGroups);
			}
			else {
				const userGroups = await Group.find({enabled: true, 'tournaments.leaderboard.user': request.payload._id}).populate('tournaments.tournament').catch(handleMongoError);
				response.ok(userGroups);
			}

		} catch (error) {
			response.server_error(error);
		}
	});

	router.delete(`${basePath}/delete/:id`, auth, async (request, response) => {
        try {
            const group = await Group.findById(request.params.id).catch(handleMongoError);

            if (!group) {
                response.reset_content("This group has already been removed!");
                return;
            }

            await Archive.findByIdAndRemove(group.photo).catch(handleMongoError);
            await group.remove().catch(handleMongoError);
            response.ok();
        } catch (error) {
            response.server_error(error);
        }
    });
    
    router.delete(`${basePath}/exit/:id`, auth, async (request, response) => {
        try {
            let index = -1;
            const group = await Group.findById(request.params.id).catch(handleMongoError);

            if (!group) {
                response.reset_content("This group has already been removed!");
                return;
            }

            group.tournaments.forEach(tournamentCross => {
                tournamentCross.leaderboard.forEach((cross, i) => {
                    if (cross.user == request.payload._id) {
                        index = i;
                        return;
                    }
                });

                if (index > -1) {
                    tournamentCross.leaderboard.splice(index, 1);
                }
            });

            if (index == -1) {
                response.reset_content("You have already been removed from the group!");
                return;
            }

            await group.save().catch(handleMongoError);
            response.ok();
        } catch (error) {
            response.server_error(error);
        }
    });

    router.post(`${basePath}/removeUser`, auth, async (request, response) => {
        try {
            let index = -1;
            const group = await Group.findById(request.body.groupId).catch(handleMongoError);

            if (!group) {
                response.reset_content("This group no longer exists!");
                return;
            }

            group.tournaments.forEach(tournamentCross => {
                tournamentCross.leaderboard.forEach((cross, i) => {
                    if (cross.user == request.body.userId) {
                        index = i;
                        return;
                    }
                });

                if (index > -1) {
                    tournamentCross.leaderboard.splice(index, 1);
                }
            });

            if (index == -1) {
                response.reset_content("The user is no longer part of this group!");
                return;
            }

            await group.save().catch(handleMongoError);
            response.ok();
        } catch (error) {
            response.server_error(error);
        }
    });

	router.post(`${basePath}/updateMyRoaster/:groupId/:tournamentId`, auth, async (request, response) => {
		try {
			let isUserInGroup = false;
			let group = await Group.findById(request.params.groupId).catch(handleMongoError);

			if (!group) {
                response.reset_content("Sorry! This group has been deleted");
                return;
            }
            
            /*const tournament = Tournament.findById(request.params.tournamentId).catch(handleMongoError);
            const today = new Date();
            const time = (today.getHours() * 60 * 60 * 1000) + (today.getMinutes() * 60 * 1000) + (today.getSeconds() * 1000) + today.getMilliseconds();
            const startDate = new Date(tournament.startDate);
            const startTime = (startDate.getHours() * 60 * 60 * 1000) + (startDate.getMinutes() * 60 * 1000) + (startDate.getSeconds() * 1000) + startDate.getMilliseconds();
            const endDate = new Date(tournament.endDate);
            const endTime = (endDate.getHours() * 60 * 60 * 1000) + (endDate.getMinutes() * 60 * 1000) + (endDate.getSeconds() * 1000) + endDate.getMilliseconds();
            
            if (today.getTime() > endDate.getTime() || (time > startTime && time < endTime)) {
                response.reset_content("Sorry! The roster cannot be edited during the round")
            }*/

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
                response.reset_content("Sorry! You were removed from this group");
                return;
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