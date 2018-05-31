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

export default function() {
	router.post('/get_earnings', auth, (req, res) => {
		Group.aggregate([
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
		])
		.exec((err, data) => {
			if (err) {
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
			.find({"tournaments.tournament": {$eq: req.body.tournament}})
			.select({_id:1, name:1, tournaments:1, "tournaments.tournament":1, "tournaments.leaderboard.score":1, "tournaments.leaderboard.rank":1, "tournaments.leaderboard.user": 1})
			.populate('tournaments.tournament', "_id name")
			.populate('tournaments.leaderboard.user', "_id fullName")
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
	
	router.post('/get_referrals', auth, (req, res) => {
		try {
			if (!req.payload._id) {
				return res.unauthorized();
			}
			
			Referred
			.find()
			.populate('user', "_id fullName")
			.populate({
				path: 'guests.user',
				select: '_id fullName',
				model: App_User
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