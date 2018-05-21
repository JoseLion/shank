import express from 'express';
import mongoose from 'mongoose';
import Q from 'q';
import moment from 'moment-timezone';

import handleMongoError from '../../service/handleMongoError';
import auth from '../../config/auth';
import xlsx from 'node-xlsx';

let router = express.Router();
let App_User = mongoose.model('App_User');
const Group = mongoose.model('Group');

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
	
	return router;
}