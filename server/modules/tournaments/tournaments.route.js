import mongoose from 'mongoose';
import express from 'express';
import auth from '../../config/auth';
import fantasy from '../../service/fantasy';
import handleMongoError from '../../service/handleMongoError';
import multer from 'multer';
import Q from 'q';

const Tournament = mongoose.model('Tournament');
const Archive = mongoose.model('Archive');
const base_path = '/tournaments'
const router = express.Router();

export default function(app) {
	router.get(`${base_path}/findAll`, auth, async (request, response) => {
		let tournaments = await Tournament.find({endDate: {$gte: new Date()}}).sort({startDate: 1}).catch(handleMongoError);
		response.ok(tournaments)
	});

	router.get(`${base_path}/updateTournaments`, auth, async (request, response) => {
		let tournaments = await fantasy.get_tournaments();
		response.ok(tournaments);
	});
	
	router.route(base_path)
	.get(auth, (req, res) => {
		Tournament.find({}, (err, data) => {
			if (err) {
				return res.server_error(err);
			}
			
			res.ok(data);
		});
	});
	
	router.route('/get_tournaments_from_fantasy')
	.post(auth, async (req, res) => {
		//let tournaments = await fantasy.get_tournaments(req.body.year);
		let tournaments = require('./fantasy.data.json')
		res.ok(tournaments);
	});
	
	router.route('/create_tournament')
	.post(auth, multer().fields([{ name: 'file1', maxCount: 1 }, { name: 'file2', maxCount: 1 }]), (req, res) => {
		try {
			let archive_one_id = mongoose.Types.ObjectId();
			
			let archive_one = new Archive({
				_id: archive_one_id,
				name: req.files['file1'][0].originalname,
				type: req.files['file1'][0].mimetype,
				size: req.files['file1'][0].size,
				data: req.files['file1'][0].buffer
			});
			
			let archive_two_id = mongoose.Types.ObjectId();
			
			let archive_two = new Archive({
				_id: archive_two_id,
				name: req.files['file2'][0].originalname,
				type: req.files['file2'][0].mimetype,
				size: req.files['file2'][0].size,
				data: req.files['file2'][0].buffer
			});
			
			let tournament = new Tournament(Object.assign({mainPhoto: archive_one_id, secondaryPhoto: archive_two_id}, req.body));
			
			let promises = [
				archive_one.save(),
				archive_two.save(),
				tournament.save()
			];
			
			Q.all(promises).then(() => {
				res.ok({});
			}, (err) => {
				res.server_error(err);
			});
    } catch (e) {
      res.server_error();
    }
	});
	
	return router;
}