import { AsyncStorage } from 'react-native';
import { ApiHost, AuthToken } from '../config/variables';

const notLogged = 'Not Logged.';

export default class BaseMode {

    constructor() {
        
    }

    static async get(resource) {
        const token = await getAuthToken();
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        };

        const response = await fetch(ApiHost + resource, options).catch(handleFetchError);
        const json = await response.json().catch(handleParsingError);
        
        if (response.status !== 200) {
            throw {
                message: json.error,
                status: response.status
            };
        }

        return json.response;
    }
    
    static async post(resource, params) {
        const token = await this.getAuthToken();
        const data = JSON.stringify(params);
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: data,
        }

        const response = await fetch(ApiHost + resource, options).catch(handleFetchError);
        const json = await response.json().catch(handleParsingError);

        if (response.status !== 200) {
            throw {
                message: json.error,
                status: response.status
            };
        }
        
        return json.response;
    }

    static async multipart(resource, data) {
        const token = await this.getAuthToken();
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + token,
            },
            body: data
        }

        const response = await fetch(ApiHost + resource, options).catch(handleFetchError);
        const json = await response.json().catch(handleParsingError);
        
        if (response.status !== 200) {
            throw {
                message: json.error,
                status: response.status
            };
        }

        return json.response;
    }

    async delete(resource, params) {
        const token = await this.getAuthToken();
        const data = JSON.stringify(params);
        const options = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: data
        };

        const response = await fetch(ApiHost + resource, options).catch(handleFetchError);
        const json = await response.json().catch(handleParsingError);
        
        if (response.status !== 200) {
            throw {
                message: json.error,
                status: response.status
            };
        }
        
        return json.response;
    }
}

async function getAuthToken() {
    const token = await AsyncStorage.getItem(AuthToken).catch(error => {throw error});
    
    if (!token) {
        throw "Session has expired... Please login!";
    }

    return token;
}

function handleFetchError(error) {
    console.log("ERROR FETCHING: ", error);
    throw "We were unable to connect to the server";
}

function handleParsingError(error) {
    console.log("ERROR PARSING JSON: ", error);
    throw "There was an error reading the response from the server";
}