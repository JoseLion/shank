import mongoose from 'mongoose';
import express from 'express';
import auth from '../../config/auth';
import handleMongoError from '../../service/handleMongoError';
import multer from 'multer';
import Q from 'q';
import PushNotifications from '../../service/pushNotification';

const Group = mongoose.model('Group');
const Archive = mongoose.model('Archive');
const AppUser = mongoose.model('App_User');
const Tournament = mongoose.model('Tournament');
const basePath = '/group';
const router = express.Router();

export default function(app) {
	router.get(`${basePath}/findMyGroups`, auth, async (request, response) => {
        const groups = await Group.find({enabled: true, 'tournaments.leaderboard.user': request.payload._id}).populate('tournaments.tournament').catch(handleMongoError);
        const today = Date.now();

        groups.forEach(group => {
            group.tournaments.sort(sortByMostActive);
        });

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
			
			Group.update({"_id": req.body._id}, { $push: { tournaments: new_tournament} }, async function(err, group) {
				if (err) {
					return res.server_error(err);
                }

                await group.tournaments.asyncForEach(async tournamentCross => {
                    if (String(tournamentCross.tournament) == String(new_tournament.tournament)) {
                        const pushNotification = new PushNotifications();

                        await tournamentCross.leaderboard.asyncForEach(async cross => {
                            const appUser = await AppUser.findById(cross.user).catch(handleMongoError);
                            const tournament = await Tournament.findById(new_tournament.tournament);
                            const today = new Date();
                            const startDate = new Date(tournament.startDate);
                            const days = Math.round((startDate.getTime() - today.getTime()) / 1000 / 60 / 60 / 24);
                            
                            appUser.notifications.forEach(push => {
                                pushNotification.send({
                                    token: push.token,
                                    os: push.os,
                                    alert: `The next tournament ${tournament.name} starts in ${days} days. Don’t miss it`
                                });
                            });
                        });
                    }
                });

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
                response.reset_content("Sorry! This group has been deleted");
                return ;
            }
            
            let isUserInGroup = false;
            group.tournaments.forEach(tournamentCross => {
                tournamentCross.leaderboard.forEach(cross => {
                    if (String(cross.user._id) === String(request.payload._id)) {
                        isUserInGroup = true;
                        return;
                    }
                });

                if (isUserInGroup) {
                    return;
                }
            });

            if (!isUserInGroup) {
                response.reset_content("Sorry! You habe been removed from this group");
                return;
            }

            group.tournaments.sort(sortByMostActive);
			response.ok(group);
		} catch (error) {
            console.error(error);
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
            const group = await Group.findById(request.params.id).populate('tournaments.leaderboard.user').catch(handleMongoError);

            if (!group) {
                response.reset_content("This group has already been removed!");
                return;
            }

            const users = group.tournaments[0].leaderboard.map(cross => cross.user);
            const groupName = group.name.toUpperCase();
            await Archive.findByIdAndRemove(group.photo).catch(handleMongoError);
            await group.remove().catch(handleMongoError);
            
            const pushNotification = new PushNotifications();
            users.forEach(user => {
                user.notifications.forEach(notif => {
                    pushNotification.send({
                        token: notif.token,
                        os: notif.os,
                        alert: `Please know that your group ${groupName} admin deleted this group`
                    });
                });
            });

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

			group.tournaments.forEach(tournamentCross => {
				if (tournamentCross.tournament == request.params.tournamentId) {
					tournamentCross.leaderboard.forEach(cross => {
						if (String(cross.user) == String(request.payload._id)) {
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

	return router;
}

function sortByMostActive(a, b) {
    const today = Date.now();
    const a1 = new Date(a.tournament.startDate);
    const a2 = new Date(a.tournament.endDate);
    const a3 = a1 - today;
    const b1 = new Date(b.tournament.startDate);
    const b2 = new Date(b.tournament.endDate);
    const b3 = b1 - today;

    if (today >= a1 && today <= a2) {
        return -1;
    }

    if (today >= b1 && today <= b2) {
        return 1
    }

    if (a3 < 0 && b3 < 0) {
        return 0;
    }

    if (a3 < 0) {
        return 1;
    }

    if (b3 < 0) {
        return -1;
    }

    return a3 - b3;
}