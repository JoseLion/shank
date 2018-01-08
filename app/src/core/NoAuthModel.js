'use strict';

import React from 'react';

import * as ApiUtils from './ApiUtils';
import * as Constants from './Constants';
import { Host, ApiHost, AuthToken, ApiKey, version } from '../config/variables';

let internetError = 'No fue posible acceder al internet de su teléfono.';
let requestServerError = 'No fue posible comunicar con el servidor.';
let parsingResponseError = 'Error al analizar la respuesta del servidor.';

let NoAuthModel = {

    async post(resource, params) {
        const data = JSON.stringify(params);
        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: data
        }

        const response = await fetch(ApiHost + resource, options).catch( error => { throw requestServerError; } );
        const json = await response.json().catch( error => { throw parsingResponseError; } );
        if (json.error !== '') throw json.error;
        else return json.response;
    },

    async multipart(resource, data) {
        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            body: data
        }

        const response = await fetch(ApiHost + resource, options).catch( error => { throw requestServerError; } );
        const json = await response.json().catch( error => { throw parsingResponseError; } );
        if (json.error !== '') throw json.error;
        else return json.response;
    },

    async get(resource) {
        let options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        };

        const response = await fetch(ApiHost + resource, options).catch( error => { throw requestServerError; } );
        const json = await response.json().catch( error => { throw parsingResponseError; } );
        if (json.error !== '') throw json.error;
        else return json.response;
    },

    async put(resource, params) {
        const data = JSON.stringify(params);
        let options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: data
        };

        const response = await fetch(ApiHost + resource, options).catch( error => { throw requestServerError; } );
        const json = await response.json().catch( error => { throw parsingResponseError; } );
        if (json.error !== '') throw json.error;
        else return json.response;
    },

    async delete(resource, params) {
        const data = JSON.stringify(params);
        let options = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: data
        };

        const response = await fetch(ApiHost + resource, options).catch( error => { throw requestServerError; } );
        const json = await response.json().catch( error => { throw parsingResponseError; } );
        if (json.error !== '') throw json.error;
        else return json.response;
    },














    // TODO: REMOVE METHOD
    async create(resource, params) {

        const data = JSON.stringify(params);

        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: data
        };

        const response = await fetch(ApiHost + resource, options).catch(
            error => {
                throw requestServerError;
            }
        );

        const json = await response.json().catch(
            error => {
                throw parsingResponseError;
            }
        );

        if (json.error !== '') {
            throw json.error;
        }
        else {
            return json.response;
        }
    },

    async update(resource, params) {

        const data = JSON.stringify(params);

        let options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: data
        }

        const response = await fetch(ApiHost + resource, options).catch(
            error => {
                throw requestServerError;
            }
        );

        const json = await response.json().catch(
            error => {
                throw parsingResponseError;
            }
        );

        if (json.error !== '') {
            throw json.error;
        }
        else {
            return json.response;
        }
    },

    async remove(resource) {

        let options = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        const response = await fetch(ApiHost + resource, options).catch(
            error => {
                throw requestServerError;
            }
        );

        const json = await response.json().catch(
            error => {
                throw parsingResponseError;
            }
        );

        if (json.error !== '') {
            //return Promise.reject(new Error(json.error));
            throw json.error;
        }
        else {
            return json.response;
        }
    },
};

export { NoAuthModel as default };
