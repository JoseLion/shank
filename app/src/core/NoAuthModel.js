import { AsyncStorage } from 'react-native';
import { ApiHost, AuthToken } from '../config/variables';
import { EventRegister } from 'react-native-event-listeners';
import { AppConst } from '../components/screens/BaseComponent';

export default class NoAuthModel {

    constructor() {
        
    }

    static async get(resource) {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        const response = await fetch(ApiHost + resource, options).catch(handleFetchError);
        const json = await response.json().catch(handleParsingError);
        
        checkResponse(response, json);
        return json.response;
    }
    
    static async post(resource, params) {
        const data = JSON.stringify(params);
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: data,
        }

        const response = await fetch(ApiHost + resource, options).catch(handleFetchError);
        const json = await response.json().catch(handleParsingError);

        checkResponse(response, json);        
        return json.response;
    }

    static async multipart(resource, data) {
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            body: data
        }

        const response = await fetch(ApiHost + resource, options).catch(handleFetchError);
        const json = await response.json().catch(handleParsingError);
        
        checkResponse(response, json);
        return json.response;
    }

    static async delete(resource, params) {
        const data = JSON.stringify(params);
        const options = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: data
        };

        const response = await fetch(ApiHost + resource, options).catch(handleFetchError);
        const json = await response.json().catch(handleParsingError);
        
        checkResponse(response, json);        
        return json.response;
    }
}

function checkResponse(response, json) {
    if (response.status !== 200) {
        throw {
            message: json.error,
            status: response.status
        };
    }
}

function handleFetchError(error) {
    console.log("ERROR FETCHING: ", error);
    throw "We were unable to connect to the server";
}

function handleParsingError(error) {
    console.log("ERROR PARSING JSON: ", error);
    throw "There was an error reading the response from the server";
}