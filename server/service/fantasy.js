import mongoose from 'mongoose';
import fetch from 'node-fetch';
import AppConst from '../config/constants';

const options = {method: 'GET',headers: {}};
options.headers[AppConst.FANTASY_HEADER] = AppConst.FANTASY_KEY;

export default {
	updateTournaments: async function() {
		console.log("Fetching tournaments from fantasydata.net...");

		const Tournament = mongoose.model('Tournament');
		const today = new Date();

		const response = await fetch(`https://api.fantasydata.net/golf/v2/JSON/Tournaments/${today.getFullYear()}`, options).catch(handleError);
		let json = await response.json().catch(handleError);
		json = normalizeKeys(json);

		json.asyncForEach(async tournament => {
			let found = await Tournament.findOne({tournamentID: tournament.tournamentID}).catch(handleError);

			if (found) {
				found.set(tournament);
				await found.save().catch(handleError);
			} else {
				await Tournament.create(tournament).catch(handleError);
			}
		});

		return json;
	},

	updatePlayers: async function() {
		console.log("Fetching players from fantasydata.net...");

		const Player = mongoose.model('Player');

		const response = await fetch('https://api.fantasydata.net/golf/v2/JSON/Players', options).catch(handleError);
		let json = await response.json().catch(handleError);
		json = normalizeKeys(json);

		json.asyncForEach(async player => {
			let found = await Player.findOne({playerID: player.playerID}).catch(handleError);

			if (found) {
				found.set(player);
				await found.save().catch(handleError);
			} else {
				await Player.create(player).catch(handleError);
			}
		});

		return json;
	},

	updateLeaderboard: async function() {
		const Leaderboard = mongoose.model('Leaderboard');
		const Tournament = mongoose.model('Tournament');
		const Player = mongoose.model('Player');

		const tournaments = await Tournament.find({}).catch(handleError);
		let count = 0;

		await tournaments.asyncForEach(async tournament => {
			console.log("Fetching leaderboard of tournament " + tournament.tournamentID + " from fantasydata.net...");

			const response = await fetch(`https://api.fantasydata.net/golf/v2/JSON/Leaderboard/${tournament.tournamentID}`, options).catch(handleError);
			let json = await response.json().catch(handleError);
			json = normalizeKeys(json);

			await json.players.asyncForEach(async cross => {
				let found = await Leaderboard.findOne({playerTournamentID: cross.playerTournamentID}).catch(handleError);
				cross.tournament = tournament;
				cross.player = await Player.findOne({playerID: cross.playerID}).catch(handleError);

				if (found) {
					found.set(cross);
					await found.save().catch(handleError);
				} else {
					await Leaderboard.create(cross).catch(handleError);
				}
			});

			count += json.players.length;
		});

		
		return count;
	}
}

function normalizeKeys(obj) {
	let newObj;
	
	if (obj instanceof Array) {
		return obj.map(function(value) {
			if (typeof value === "object") {
				value = normalizeKeys(value);
			}
	
			return value;
		});
	} else {
		newObj = {};
		
		for (let origKey in obj) {
			if (obj.hasOwnProperty(origKey)) {
				let newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
				let value = obj[origKey];
				
				if (value instanceof Array || (value !== null && value.constructor === Object)) {
					value = normalizeKeys(value);
				}
	
				newObj[newKey] = value;
			}
		}
	}

	return newObj;
}

function handleError(error) {
	console.log("There was an error with mongoose: " + error);
}