import express from 'express';
import mailer from 'express-mailer';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import customResponses from 'express-custom-response';
import cors from 'cors';
import ejs from 'ejs';
import loadModules from './modules/load.modules';
import fantasy from './service/fantasy';
import setPassport from './config/passport';

import { CronJob } from 'cron';
import handleMongoError from './service/handleMongoError';
import AssignPoints from './service/assignPoints';


/**
* Custom prototypes
*/
if (!Array.prototype.asyncForEach) {
  Array.prototype.asyncForEach = async function(callback) {
    for (let i = 0; i < this.length; i++) {
      await callback(this[i], i);
    }
  }
}

let app = express();

const databaseUri = 'mongodb://localhost:27017/shank';
mongoose.Promise = global.Promise;
mongoose.connect(databaseUri, {}).then(async () => {
	console.log(`Database connected at ${databaseUri}`);

	/*let tournaments = await fantasy.updateTournaments().catch(error => console.log("Error fetching from fantasydata.net: ", error));
	console.log("Tournaments updated! (Total: " + tournaments.length + ")");

	let players = await fantasy.updatePlayers().catch(error => console.log("Error fetching from fantasydata.net: ", error));
	console.log("Players updated! (Total: " + players.length + ")");

	let total = await fantasy.updateLeaderboard();
	console.log("Updated " + total + " leaderboards in all tournaments!");*/
}).catch(err => console.log(`Database connection error: ${err.message}`));

customResponses(path.join(__dirname, '/modules/responses'));

app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, content-type, Accept, Authorization');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

loadModules(app);

app.use('/', express['static'](__dirname + '/../web/dist'));

setPassport();

app.use(passport.initialize());

app.use(function (req, res, next) {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		if (err.code === 'invalid_token') {
			return res.unauthorized(err.status);
		}

		if (err.code === 'permission_denied') {
			return res.forbidden(err.status);
		}

		res.status(err.status || 500).json({response: {}, error: err.message});
	});
}

app.use(function (err, req, res, next) {
	if (err.code === 'invalid_token') {
		return res.status(err.status).json({response: {}, error: 'User not authorized'});
	}

	if (err.code === 'permission_denied') {
		return res.status(err.status).json({response: {}, error: 'Permission denied'});
	}

	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

/** THIS CODE SHOUD CHANGE, THIS IS A BURNT VERSION OF WHAT SHOULD BE DONE WHEN A TOURNAMENT IS ADDED TO THE DB **/

async function createCrons(id) {
	const Tournament = mongoose.model('Tournament');
	const tournament = await Tournament.findById(id).catch(handleMongoError);

	tournament.rounds.forEach(round => {
		new CronJob({
			cronTime: `0 30 19 ${round.day.getDate()} ${round.day.getMonth()} ${round.day.getDay()}`,
			onTick: () => {
				AssignPoints(tournament._id, round.number);
				this.stop();
			},
			start: true,
			timeZone: 'America/Guayaquil'
		});
	});
}

createCrons("5aba80adda048b2aa431dacb");

/** ----------------------------------------------------------------------------------------------------------- **/


module.exports = app;