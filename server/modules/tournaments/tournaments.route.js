import mongoose from 'mongoose';
import express from 'express';
import auth from '../../config/auth';
import fantasy from '../../service/fantasy';
import handleMongoError from '../../service/handleMongoError';
import multer from 'multer';
import Q from 'q';
import serverConfig from '../../config/server';

const Tournament = mongoose.model('Tournament');
const Archive = mongoose.model('Archive');
const base_path = '/tournament'
const router = express.Router();

export default function() {
	router.get(`${base_path}/findAll`, auth, async (request, response) => {
		let tournaments = await Tournament.find({endDate: {$gte: new Date()}}).sort({startDate: 1}).catch(handleMongoError);
		response.ok(tournaments);
	});

	router.get(`${base_path}/updateTournaments`, auth, async (request, response) => {
		let tournaments = await fantasy.get_tournaments();
		response.ok(tournaments);
	});
	
	router.route('/tournaments')
	.get(auth, async (req, res) => {
		let tournaments = await Tournament.find().catch((err) => {res.server_error(err);});
		
		res.ok(tournaments);
	});
	
	router.route('/tournaments/:_id')
	.get(auth, async (req, res) => {
		let tournament = await Tournament.findOne(req.params).catch((err) => {res.server_error(err);});
		
		res.ok(tournament);
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
			let promises = [];
			
			if (req.files['file1']) {
				let archive_one_id = mongoose.Types.ObjectId();
				
				let archive_one = new Archive({
					_id: archive_one_id,
					name: req.files['file1'][0].originalname,
					type: req.files['file1'][0].mimetype,
					size: req.files['file1'][0].size,
					data: req.files['file1'][0].buffer
				});
				
				promises.push(archive_one.save());
			}
			
			if (req.files['file2']) {
				let archive_two_id = mongoose.Types.ObjectId();
				
				let archive_two = new Archive({
					_id: archive_two_id,
					name: req.files['file2'][0].originalname,
					type: req.files['file2'][0].mimetype,
					size: req.files['file2'][0].size,
					data: req.files['file2'][0].buffer
				});
				
				promises.push(archive_two.save());
			}
			
			if (req.files['file1'] && req.files['file2']) {
				let tournament = new Tournament(Object.assign({mainPhoto: archive_one_id, secondaryPhoto: archive_two_id}, req.body));
				
				promises.push(tournament.save());
			}
			else if (req.files['file1']) {
				let tournament = new Tournament(Object.assign({mainPhoto: archive_one_id}, req.body));
			}
			else if (req.files['file2']) {
				let tournament = new Tournament(Object.assign({secondaryPhoto: archive_two_id}, req.body));
			}
			
			Q.all(promises).then(() => {
				res.ok({});
			}, (err) => {
				res.server_error(err);
			});
    } catch (e) {
			console.log(e, '----------------------');
      res.server_error();
    }
	});
	
	return router;
}