import fetch from 'node-fetch';

const _url = 'https://restcountries.eu/rest/v2/all?fields=name';
const options = {method: 'GET', headers: {}};

export default {
	get_all_countries: async function(year) {
    const response = await fetch(`${_url}`, options).catch(handleError);
    
		let json = await response.json().catch(handleError);
		return json;
	}
}

function handleError(error) {
	console.log("There was an error with mongoose: " + error);
}