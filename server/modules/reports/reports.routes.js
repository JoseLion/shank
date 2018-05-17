import express from 'express';
import mongoose from 'mongoose';
import Q from 'q';
import moment from 'moment-timezone';

import handleMongoError from '../../service/handleMongoError';

let router = express.Router();
let App_User = mongoose.model('App_User');

export default function() {
	router.post('/get_earnings', async (req, res) => {
		let users = await App_User.find({}).select('_id fullName country created_at').catch(handleMongoError);
		res.ok(users);
	});
	
	return router;
}