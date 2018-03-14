import mongoose from 'mongoose';
import fetch from 'node-fetch';

export default {
	updateTournaments: function() {
		const Tournament = mongoose.model('Tournament');
		const today = new Date();
		const options = {
			method: 'GET',
			headers: {
				'Ocp-Apim-Subscription-Key': '519f4de87ff044afb2796f57a6583a4d'
			}
		};

		console.log("Fetching tournaments from fantasydata.net...");

		return fetch(`https://api.fantasydata.net/golf/v2/JSON/Tournaments/${today.getFullYear()}`, options).then(response => response.json()).then(json => {
			json = normalizeKeys(json);
			let ids = json .map(tournament => tournament.tournamentID);

			return Promise.all([
				json,
				Tournament.find({tournamentID: {$in: ids}})
			]);
		}).then(([json, tournaments]) => {
			let tournamentsById = tournaments

			let promises = json.map(tournament => {
				let found = tournaments.find((_tournament) => {
					return _tournament.tournamentID === tournament.tournaments;
				});

				if (found) {
					found.set(tournament);
					return found.save();
				} else {
					return Tournament.create(tournament);
				}
			});

			return Promise.all(promises);
		})
		.catch(error => console.log("Error fetching: ", error));
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