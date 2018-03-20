import mongoose from 'mongoose';
import fetch from 'node-fetch';

export default {
	updateTournaments: function() {
		console.log("Fetching tournaments from fantasydata.net...");

		const Tournament = mongoose.model('Tournament');
		const today = new Date();
		const options = {
			method: 'GET',
			headers: {'Ocp-Apim-Subscription-Key': '519f4de87ff044afb2796f57a6583a4d'}
		};

		return fetch(`https://api.fantasydata.net/golf/v2/JSON/Tournaments/${today.getFullYear()}`, options).then(async response => {
			let json = await response.json().catch(handleError);
			json = normalizeKeys(json);

			json.forEach(async tournament => {
				let found = await Tournament.findOne({tournamentID: tournament.tournamentID}).catch(handleError);

				if (found) {
					found.set(tournament);
					await found.save().catch(handleError);
				} else {
					await Tournament.create(tournament).catch(handleError);
				}
			});

			return json;
		});
	},

	updatePlayers: function() {
		console.log("Fetching players from fantasydata.net...");

		const Player = mongoose.model('Player');
		const options = {
			method: 'GET',
			headers: {'Ocp-Apim-Subscription-Key': '519f4de87ff044afb2796f57a6583a4d'}
		};

		return fetch('https://api.fantasydata.net/golf/v2/JSON/Players', options).then(async response => {
			let json = await response.json().catch(handleError);
			json = normalizeKeys(json);

			json.forEach(async player => {
				let found = await Player.findOne({playerID: player.playerID}).catch(handleError);

				if (found) {
					found.set(player);
					await found.save().catch(handleError);
				} else {
					await Player.create(player).catch(handleError);
				}
			});

			return json;
		});
	},

	updateLeaderboard: function(tournamentId) {
		console.log("Fetching leaderboard of tournament " + tournamentId + " from fantasydata.net...");

		const Leaderboard = mongoose.model('Leaderboard');
		const Tournament = mongoose.model('Tournament');
		const Player = mongoose.model('Player');
		const options = {
			method: 'GET',
			headers: {'Ocp-Apim-Subscription-Key': '519f4de87ff044afb2796f57a6583a4d'}
		};

		return fetch(`https://api.fantasydata.net/golf/v2/JSON/Leaderboard/${tournamentId}`, options).then(async response => {
			let json = await response.json().catch(handleError);
			json = normalizeKeys(json);
			const tournament = await Tournament.findOne({tournamentID: json.tournament.tournamentID}).catch(handleError);

			json.players.forEach(async cross => {
				cross.tournament = tournament;
				cross.player = await Player.findOne({playerID: cross.playerID}).catch(handleError);

				let found = await Leaderboard.findOne({playerTournamentID: cross.playerTournamentID}).catch(handleError);

				if (found) {
					found.set(cross);
					await found.save().catch(handleError);
				} else {
					await Leaderboard.create(cross).catch(handleError);
				}
			});

			return json.players;
		});
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