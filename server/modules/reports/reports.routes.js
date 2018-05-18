import express from 'express';
import mongoose from 'mongoose';
import Q from 'q';
import moment from 'moment-timezone';

import handleMongoError from '../../service/handleMongoError';

let router = express.Router();
let App_User = mongoose.model('App_User');
const Group = mongoose.model('Group');

export default function() {
	router.post('/get_earnings', (req, res) => {
		Group.aggregate([
		 { "$unwind": "$tournaments" },
		 { "$unwind": "$tournaments.leaderboard" },
		 { "$lookup": {
				 "from": "tournaments",
				 "localField": "tournaments.tournament",
				 "foreignField": "_id",
				 "as": "tournament"
			 }
		 },
		 { "$unwind": "$tournament" },
		 { "$project" : { "tournament" : 1,  "tournaments.leaderboard.user" : 1} },
		 { "$lookup": {
				 "from": "app_users",
				 "localField": "tournaments.leaderboard.user",
				 "foreignField": "_id",
				 "as": "user"
			 }
		 },
		 { "$unwind": "$user" },
		 { "$project" : { "user" : {"_id": "$user._id", "fullName": "$user.fullName"},  "tournament" : {"_id": "$tournament._id", "name": "$tournament.name"} }},
		])
		.exec((err, data) => {
			if (err) {
				return res.server_error(err.message);
			}
			
			res.ok(data);
		});
	});
	
	return router;
}