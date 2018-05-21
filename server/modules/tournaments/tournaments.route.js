import mongoose from 'mongoose';
import express from 'express';
import auth from '../../config/auth';
import fantasy from '../../service/fantasy';
import handleMongoError from '../../service/handleMongoError';
import multer from 'multer';
import Q from 'q';
import serverConfig from '../../config/server';
import leaderboard_service from '../leaderboard/leaderboard.service';
import date_service from '../services/date.services';
import CronJobs from '../../service/cronJobs';


const Tournament = mongoose.model('Tournament');
const Archive = mongoose.model('Archive');
const Group = mongoose.model('Group');
const base_path = '/tournament'
const router = express.Router();

export default function() {
	router.get(`${base_path}/findAll`, auth, async (request, response) => {
		let tournaments = await Tournament.find({endDate: {$gte: date_service.utc_unix_current_date()}}).sort({startDate: 1}).catch(handleMongoError);
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
	
	router.route('/tournaments/:_id')
	.put(auth, async (req, res) => {
		let tournament = await Tournament.findByIdAndUpdate(req.params, req.body).catch((err) => {res.server_error(err);});
		
		res.ok(tournament);
	});
	
	router.route('/get_tournaments_from_fantasy')
	.post(auth, async (req, res) => {
		//let tournaments = await fantasy.get_tournaments(req.body.year);
		let tournaments = require('./fantasy.tournaments.data.json');
		res.ok(tournaments);
	});
	
	router.route('/create_tournament')
	.post(auth, multer().fields([{ name: 'file1', maxCount: 1 }, { name: 'file2', maxCount: 1 }]), (req, res) => {
		try {
			let promises = [];
			let archive_one_id;
			let archive_two_id;
			
			if (req.files['file1']) {
				archive_one_id = mongoose.Types.ObjectId();
				
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
				archive_two_id = mongoose.Types.ObjectId();
				
				let archive_two = new Archive({
					_id: archive_two_id,
					name: req.files['file2'][0].originalname,
					type: req.files['file2'][0].mimetype,
					size: req.files['file2'][0].size,
					data: req.files['file2'][0].buffer
				});
				
				promises.push(archive_two.save());
			}
			
			let tournament = new Tournament(Object.assign({mainPhoto: archive_one_id, secondaryPhoto: archive_two_id}, req.body));
			promises.push(tournament.save());

			const startDate = new Date(tournament.startDate);
			const cronTime = `00 00 16 ${startDate.getDate() - 1} ${startDate.getMonth()} ${startDate.getDay()}`;
			CronJobs.create({ cronTime, functionName: 'tournamentStartReminder', args: tournament._id });
			
			Q.all(promises).spread((archive1_saved, archive2_saved, tournament_saved) => {
				req.body._id = tournament_saved._id;
				console.log(req.body);
				leaderboard_service.load_leaderboard(req, res);
			}, (err) => {
				res.server_error(err);
			});
    } catch (e) {
      res.server_error();
    }
	});
	
	router.route('/update_tournament')
	.post(auth, multer().fields([{ name: 'file1', maxCount: 1 }, { name: 'file2', maxCount: 1 }]), (req, res) => {
		try {
			let promises = [];
			
			if (req.files['file1']) {
				promises.push(Archive.findByIdAndRemove(req.body.mainPhoto).exec());
				
				let archive_one_id = mongoose.Types.ObjectId();
				req.body.mainPhoto = archive_one_id;
				
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
				promises.push(Archive.findByIdAndRemove(req.body.secondaryPhoto).exec());
				
				let archive_two_id = mongoose.Types.ObjectId();
				req.body.secondaryPhoto = archive_two_id;
				
				let archive_two = new Archive({
					_id: archive_two_id,
					name: req.files['file2'][0].originalname,
					type: req.files['file2'][0].mimetype,
					size: req.files['file2'][0].size,
					data: req.files['file2'][0].buffer
				});
				
				promises.push(archive_two.save());
			}
			
			promises.push(Tournament.update({_id: req.body._id}, req.body).exec());

			const startDate = new Date(tournament.startDate);
			const cronTime = `00 00 16 ${startDate.getDate() - 1} ${startDate.getMonth()} ${startDate.getDay()}`;
			CronJobs.remove({reference: req.body._id});
			CronJobs.create({ cronTime, functionName: 'tournamentStartReminder', args: req.body._id });
			
			Q.all(promises).then(() => {
				leaderboard_service.load_leaderboard(req, res);
			}, (err) => {
				res.server_error(err);
			});
    } catch (e) {
      res.server_error();
    }
	});
	
	router.route('/remove_tournaments')
	.post(auth, async (req, res) => {
		try {
			let promises = [
				Tournament.findByIdAndRemove(req.body._id).exec(),
				Archive.findByIdAndRemove(req.body.mainPhoto).exec(),
				Archive.findByIdAndRemove(req.body.secondaryPhoto).exec()
			];
			
      Q.all(promises).spread((tournament) => {
        res.ok(tournament);
      }, (err) => {
        res.server_error(err);
      });
    } catch (e) {
      res.server_error();
    }
	});
	
	return router;
}