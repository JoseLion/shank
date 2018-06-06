import express from 'express';
import mongoose from 'mongoose';
import Q from 'q';
import _ from 'underscore';
import xlsx from 'node-xlsx';

import handleMongoError from '../../service/handleMongoError';
import auth from '../../config/auth';
import date_service from '../services/date.services';

let router = express.Router();
const Acquisition = mongoose.model('Acquisition');
const App_User = mongoose.model('App_User');
const Group = mongoose.model('Group');
const Referred = mongoose.model('Referred');
const Player = mongoose.model('Player');

function get_change_of_players(round, old_roaster, current_roaster) {
	var old_players = [];
	var current_players = [];
	
	if (round > 1 && round < 4) {
		var number = old_roaster.length;
		if (number > 0) {
			var i;
			
			for (i = 0; i < number; i++) {
				if (String(old_roaster[i].player._id) !== String(current_roaster[i].player._id)) {
					old_players.push(old_roaster[i].player.firstName + ' ' + old_roaster[i].player.lastName);
					current_players.push(current_roaster[i].player.firstName + ' ' + current_roaster[i].player.lastName);
				}
			}
		}
	}
	
	return {old_players: old_players, current_players: current_players};
}

export default function() {
	router.post('/get_earnings', auth, (req, res) => {
		let  aggregate_params = [
			{"$unwind": "$tournaments"},
			{"$unwind": "$tournaments.leaderboard"},
			{"$lookup": {
					"from": "tournaments",
					"localField": "tournaments.tournament",
					"foreignField": "_id",
					"as": "tournament"
				}
			},
			{"$unwind": "$tournament"},
			{"$project": {"tournament": 1, "tournaments.leaderboard": 1}},
			{"$lookup": {
					"from": "app_users",
					"localField": "tournaments.leaderboard.user",
					"foreignField": "_id",
					"as": "user"
				}
			},
			{"$unwind": "$user"},
			{"$project": {
					"user": {
						"_id": "$user._id",
						"fullName": "$user.fullName",
						"register_os": "$user.register_os",
						"country": "$user.country",
						"created_at": "$user.created_at"
					},
					"tournament": {
						"_id": "$tournament._id",
						"name": "$tournament.name",
						"country": "$tournament.country",
						"city": "$tournament.city"
					},
					"leaderboard": {
						"_id": "$tournaments.leaderboard._id",
						"checkouts": "$tournaments.leaderboard.checkouts",
						"rank": "$tournaments.leaderboard.rank",
						"score": "$tournaments.leaderboard.score",
						"user": "$tournaments.leaderboard.user"
					}
				}
			}
		];
		
		if (req.body.country) {
			aggregate_params = [
				{"$unwind": "$tournaments"},
				{"$unwind": "$tournaments.leaderboard"},
				{"$lookup": {
						"from": "tournaments",
						"localField": "tournaments.tournament",
						"foreignField": "_id",
						"as": "tournament"
					}
				},
				{"$unwind": "$tournament"},
				{"$project": {"tournament": 1, "tournaments.leaderboard": 1}},
				{"$lookup": {
						"from": "app_users",
						"localField": "tournaments.leaderboard.user",
						"foreignField": "_id",
						"as": "user"
					}
				},
				{"$unwind": "$user"},
				{"$match": {"user.country": req.body.country}},
				{"$project": {
						"user": {
							"_id": "$user._id",
							"fullName": "$user.fullName",
							"register_os": "$user.register_os",
							"country": "$user.country",
							"created_at": "$user.created_at"
						},
						"tournament": {
							"_id": "$tournament._id",
							"name": "$tournament.name",
							"country": "$tournament.country",
							"city": "$tournament.city"
						},
						"leaderboard": {
							"_id": "$tournaments.leaderboard._id",
							"checkouts": "$tournaments.leaderboard.checkouts",
							"rank": "$tournaments.leaderboard.rank",
							"score": "$tournaments.leaderboard.score",
							"user": "$tournaments.leaderboard.user"
						}
					}
				}
			];
		}
		
		if (req.body.from_date && req.body.to_date) {
			let from_date = date_service.to_utc_unix(req.body.from_date + " 00:00:00");
			let to_date = date_service.to_utc_unix(req.body.to_date + " 23:59:59");
			
			aggregate_params = [
				{"$unwind": "$tournaments"},
				{"$unwind": "$tournaments.leaderboard"},
				{"$lookup": {
						"from": "tournaments",
						"localField": "tournaments.tournament",
						"foreignField": "_id",
						"as": "tournament"
					}
				},
				{"$unwind": "$tournament"},
				{"$project": {"tournament": 1, "tournaments.leaderboard": 1}},
				{"$match": {"tournaments.leaderboard.checkouts.payment_date": {$gte: from_date, $lt: to_date}}},
				{"$lookup": {
						"from": "app_users",
						"localField": "tournaments.leaderboard.user",
						"foreignField": "_id",
						"as": "user"
					}
				},
				{"$unwind": "$user"},
				{"$project": {
						"user": {
							"_id": "$user._id",
							"fullName": "$user.fullName",
							"register_os": "$user.register_os",
							"country": "$user.country",
							"created_at": "$user.created_at"
						},
						"tournament": {
							"_id": "$tournament._id",
							"name": "$tournament.name",
							"country": "$tournament.country",
							"city": "$tournament.city"
						},
						"leaderboard": {
							"_id": "$tournaments.leaderboard._id",
							"checkouts": "$tournaments.leaderboard.checkouts",
							"rank": "$tournaments.leaderboard.rank",
							"score": "$tournaments.leaderboard.score",
							"user": "$tournaments.leaderboard.user"
						}
					}
				}
			];
		}
		
		if (req.body.country && req.body.from_date && req.body.to_date) {
			let from_date = date_service.to_utc_unix(req.body.from_date + " 00:00:00");
			let to_date = date_service.to_utc_unix(req.body.to_date + " 23:59:59");
			
			aggregate_params = [
				{"$unwind": "$tournaments"},
				{"$unwind": "$tournaments.leaderboard"},
				{"$lookup": {
						"from": "tournaments",
						"localField": "tournaments.tournament",
						"foreignField": "_id",
						"as": "tournament"
					}
				},
				{"$unwind": "$tournament"},
				{"$project": {"tournament": 1, "tournaments.leaderboard": 1}},
				{"$match": {"tournaments.leaderboard.checkouts.payment_date": {$gte: from_date, $lt: to_date}}},
				{"$lookup": {
						"from": "app_users",
						"localField": "tournaments.leaderboard.user",
						"foreignField": "_id",
						"as": "user"
					}
				},
				{"$unwind": "$user"},
				{"$match": {"user.country": req.body.country}},
				{"$project": {
						"user": {
							"_id": "$user._id",
							"fullName": "$user.fullName",
							"register_os": "$user.register_os",
							"country": "$user.country",
							"created_at": "$user.created_at"
						},
						"tournament": {
							"_id": "$tournament._id",
							"name": "$tournament.name",
							"country": "$tournament.country",
							"city": "$tournament.city"
						},
						"leaderboard": {
							"_id": "$tournaments.leaderboard._id",
							"checkouts": "$tournaments.leaderboard.checkouts",
							"rank": "$tournaments.leaderboard.rank",
							"score": "$tournaments.leaderboard.score",
							"user": "$tournaments.leaderboard.user"
						}
					}
				}
			];
		}
		
		Group.aggregate(aggregate_params)
		.exec((err, data) => {
			if (err) {
				console.log(err, '*****--------*********');
				return res.server_error(err.message);
			}
			
			res.ok(data);
		});
	});
	
	router.post('/get_earnings_xlsx', (req, res) => {
		const data = [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
		let buffer = xlsx.build([{name: "mySheetName", data: data}]); // Returns a buffer
		/* send to client */
		res.status(200).end(buffer, 'binary');
	});
	
	router.post('/get_funnel', auth, (req, res) => {
		try {
			let promises = [
				Acquisition.count({}).exec(),
				App_User.count({}).exec(),
				Group.find().distinct('owner').exec(),
				Group.aggregate([
					{$project: {_id: 1, tournaments: {_id: 1, leaderboard: {_id: 1, user: 1, checkouts: 1}}}}
				]).exec()
			];
			
			Q.all(promises).spread((acquisition, app_user, referral, revenues) => {
				let users = [];
				let user_in;
				let all_users = [];
				let user_in_all;
				let duplicate_users = [];
				
				revenues.map((revenue) => {
					revenue.tournaments.map((tournament) => {
						tournament.leaderboard.map((leaderboard) => {
							if (leaderboard.checkouts.length > 0) {
								user_in = users.indexOf(String(leaderboard.user));
								if (user_in === -1) {
									users.push(String(leaderboard.user));
								}
							}
							
							user_in_all = all_users.indexOf(String(leaderboard.user));
							if (user_in_all === -1) {
								all_users.push(String(leaderboard.user));
							}
							else {
								duplicate_users.push(String(leaderboard.user));
							}
						});
					});
				});
				
				duplicate_users = _.uniq(duplicate_users);
				
				let data = {
					acquisition: acquisition,
					activation: app_user,
					retention: duplicate_users.length,
					referral: referral.length,
					revnue: users.length
				};
				res.ok(data);
			}, (err) => {
				res.server_error(err);
			});
    } catch (e) {
      res.server_error();
    }
	});
	
	router.post('/get_app_users', auth, (req, res) => {
		try {
			if (!req.payload._id) {
				return res.unauthorized();
			}
			
			let params_filter = {};
			
			if (req.body.from_date) {
				let from_date = date_service.to_utc_unix(req.body.from_date + " 00:00:00");
				let to_date = date_service.to_utc_unix(req.body.to_date + " 23:59:59");
				params_filter = {"created_at": {"$gte": from_date, "$lt": to_date}};
			}
			
			App_User
			.find(params_filter)
			.select("_id fullName gender country email isFacebookUser created_at")
			.exec((err, data) => {
				if (err) {
					return res.server_error(err.message);
				}
				
				res.ok(data);
			});
    } catch (e) {
      res.server_error();
    }
	});
	
	router.post('/get_ranking_by_tournament', auth, (req, res) => {
		try {
			if (!req.payload._id) {
				return res.unauthorized();
			}
			
			Group
			.find()
			.select({
				_id:1,
				name:1,
				"tournaments.tournament": 1,
				"tournaments.leaderboard.score":1,
				"tournaments.leaderboard.rank":1,
				"tournaments.leaderboard.user": 1
			})
			.populate('tournaments.tournament', "_id name")
			.populate('tournaments.leaderboard.user', "_id fullName")
			.exec((err, groups) => {
				if (err) {
					return res.server_error(err.message);
				}
				
				groups = groups.filter(function(group) {
					group.tournaments = group.tournaments.filter(function(tournament) {
						return (String(tournament.tournament._id) === req.body.tournament);
					});
					
					return group;
				});
				
				res.ok(groups);
			});
    } catch (e) {
      res.server_error();
    }
	});
	
	router.post('/get_referrals', auth, (req, res) => {
		try {
			if (!req.payload._id) {
				return res.unauthorized();
			}
			
			let main_filter = {};
			
			if (req.body.country) {
			  main_filter.country = req.body.country;
			}
			
			Referred
			.find()
			.populate({
				path: 'user',
				select: "_id fullName country created_at",
				match: main_filter
			})
			.populate({
				path: 'guests.user',
				select: "_id fullName country created_at",
				match: main_filter
			})
			.exec((err, referrals) => {
				if (err) {
					return res.server_error(err.message);
				}
				
				let from_date = null;
				let to_date = null;
				
				if (req.body.from_date && req.body.to_date) {
					from_date = date_service.to_utc_unix(req.body.from_date + " 00:00:00");
					to_date = date_service.to_utc_unix(req.body.to_date + " 23:59:59");
				}
				
				referrals = referrals.filter(function(referred) {
					referred.guests = referred.guests.filter(function(guest) {
						return guest.user;
					});
					
					if (from_date) {
						referred.guests = referred.guests.filter(function(guest) {
							return (guest.created_at >= from_date && guest.created_at <= to_date);
						});
					}
					
					return referred.user;
				});
				
				res.ok(referrals);
			});
    } catch (e) {
      res.server_error();
    }
	});
	
	router.post('/get_player_payments', auth, (req, res) => {
		try {
			if (!req.payload._id) {
				return res.unauthorized();
			}
			
			Group
			.find()
			.select({
				_id: 1,
				name: 1,
				tournaments: 1,
				"tournaments.tournament": 1,
				"tournaments.leaderboard.user": 1,
				"tournaments.leaderboard.checkouts": 1,
				"tournaments.leaderboard.checkouts.originalRoaster": 1,
				"tournaments.leaderboard.checkouts.roaster": 1,
				"tournaments.leaderboard.checkouts.round": 1,
				"tournaments.leaderboard.checkouts.payment": 1,
				"tournaments.leaderboard.checkouts.payment_date": 1,
			})
			.populate('tournaments.tournament', "_id name")
			.populate('tournaments.leaderboard.user', "_id fullName")
			.populate({
				path: 'tournaments.leaderboard.checkouts.originalRoaster',
				select: '_id playerTournamentID player',
				populate: {
					path: 'player',
					select: '_id firstName lastName',
					model: Player
				}
			})
			.populate({
				path: 'tournaments.leaderboard.checkouts.roaster',
				select: '_id playerTournamentID player',
				populate: {
					path: 'player',
					select: '_id firstName lastName',
					model: Player
				}
			})
			.exec((err, groups) => {
				if (err) {
					return res.server_error(err.message);
				}
				
				let from_date = null;
				let to_date = null;
				
				if (req.body.from_date && req.body.to_date) {
					from_date = date_service.to_utc_unix(req.body.from_date + " 00:00:00");
					to_date = date_service.to_utc_unix(req.body.to_date + " 23:59:59");
				}
				
				let players = [];
				
				groups.map(function(group) {
					group.tournaments.map(function(tournament) {
						tournament.leaderboard.map(function(leaderboard) {
							leaderboard.checkouts.map(function(checkout) {
								if (from_date) {
									if (checkout.payment_date >= from_date && checkout.payment_date <= to_date) {
										players.push({
											tournament: tournament.tournament.name,
											group: group.name,
											user_name: leaderboard.user.fullName,
											round: checkout.round,
											amount: checkout.payment,
											payment_date: checkout.payment_date,
											old_players: get_change_of_players(checkout.round, checkout.originalRoaster, checkout.roaster).old_players,
											current_players: get_change_of_players(checkout.round, checkout.originalRoaster, checkout.roaster).current_players
										});
									}
								}
								else {
									players.push({
										tournament: tournament.tournament.name,
										group: group.name,
										user_name: leaderboard.user.fullName,
										round: checkout.round,
										amount: checkout.payment,
										payment_date: checkout.payment_date,
										old_players: get_change_of_players(checkout.round, checkout.originalRoaster, checkout.roaster).old_players,
										current_players: get_change_of_players(checkout.round, checkout.originalRoaster, checkout.roaster).current_players
									});
								}
							});
						});
					});
				});
				
				res.ok(players);
			});
    } catch (e) {
      res.server_error();
    }
	});
	
	router.post('/get_initial_data_for_dashboar', auth, (req, res) => {
		try {
			if (!req.payload._id) {
				return res.unauthorized();
			}
			
			Group
			.find()
			.select({
				_id: 1,
				name: 1,
				tournaments: 1,
				"tournaments.tournament": 1,
				"tournaments.leaderboard.user": 1,
				"tournaments.leaderboard.checkouts": 1,
				"tournaments.leaderboard.checkouts.originalRoaster": 1,
				"tournaments.leaderboard.checkouts.roaster": 1,
				"tournaments.leaderboard.checkouts.round": 1,
				"tournaments.leaderboard.checkouts.payment": 1
			})
			.populate('tournaments.tournament', "_id name")
			.populate('tournaments.leaderboard.user', "_id fullName")
			.populate({
				path: 'tournaments.leaderboard.checkouts.originalRoaster',
				select: '_id playerTournamentID player',
				populate: {
					path: 'player',
					select: '_id firstName lastName',
					model: Player
				}
			})
			.populate({
				path: 'tournaments.leaderboard.checkouts.roaster',
				select: '_id playerTournamentID player',
				populate: {
					path: 'player',
					select: '_id firstName lastName',
					model: Player
				}
			})
			.exec((err, data) => {
				if (err) {
					return res.server_error(err.message);
				}
				
				res.ok(data);
			});
    } catch (e) {
      res.server_error();
    }
	});
	
	return router;
}