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
			let json = await response.json().catch(error => handleError(error));
			json = normalizeKeys(json);

			json.forEach(async tournament => {
				let found = await Tournament.findOne({tournamentID: tournament.tournamentID}).catch(error => handleError(error));

				if (found) {
					found.set(tournament);
					await found.save().catch(error => handleError(error));
				} else {
					await Tournament.create(tournament).catch(error => hendleError(error));
				}
			});

			return json;
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