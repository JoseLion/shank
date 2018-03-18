'use strict';
import React, { Component } from 'react';
import * as AppConst from './AppConst';
import { GolfApiHost } from '../config/variables';

let internetError = 'No fue posible acceder al internet de su teléfono.';
let requestServerError = 'No fue posible comunicar con el servidor.';
let parsingResponseError = 'Error al analizar la respuesta del servidor.';
let notLogged = 'Not Logged.';

function request(method, resource, params) {
    let path = GolfApiHost + resource;
    let json = JSON.stringify(!params ? {} : params);
    let options = {
        method: method,
        headers: {
            'Ocp-Apim-Subscription-Key': `${AppConst.FANTASY_DATA_API_KEY}`
        }
    };
    if(method === 'POST') { options.body = json; }
    console.log('PATH: ', path);
    return fetch(path, options);
}

let GolfApiModel = {
    post: async(resource, params) => {
        let response = await request('POST', resource, params);
        const json = await response.json().catch(
            error => {
                throw parsingResponseError;
            }
        );

        if (json.error !== '') throw json.error;
        else return json.response;
    },

    get: async(resource) => {
        let response = await request('GET', resource).catch(error => {
            throw requestServerError;
        });
        let jsonResponse = await response.json().catch(error => {
            throw parsingResponseError;
        });
        return jsonResponse;
    }
};

export {GolfApiModel as default};
