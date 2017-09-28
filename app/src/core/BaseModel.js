'use strict';

import React, {Component} from 'react';

import {
    AsyncStorage,
} from 'react-native';

import * as ApiUtils from './ApiUtils';
import {Host, ApiHost, AuthToken, ApiKey, version} from '../config/variables';

let internetError = 'No fue posible acceder al internet de su teléfono.';
let requestServerError = 'No fue posible comunicar con el servidor.';
let parsingResponseError = 'Error al analizar la respuesta del servidor.';
let notLogged = 'Not Logged.';

function request(method, resource, params) {

    let path = ApiHost + resource;

    // Serialize and post the data
    if (!params) {
        params = {};
    }
    const json = JSON.stringify(params);

    return fetch(path, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: json
    })
        .then(ApiUtils.CHECK_STATUS)
        .then(response => {
            response.json();
        })
        .catch(e => e)
}

let BaseModel = {

    async get(resource) {

        let token = await AsyncStorage.getItem(AuthToken);

        if (!token) {
            throw notLogged;
        }

        let options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        };
        console.log(ApiHost + resource, '**********************-----------------------');
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

    async create(resource, params) {

        let token = await AsyncStorage.getItem(AuthToken);

        if (!token) {
            throw notLogged;
        }

        const data = JSON.stringify(params);

        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
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

        let token = await AsyncStorage.getItem(AuthToken);

        if (!token) {
            throw notLogged;
        }

        const data = JSON.stringify(params);

        let options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
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

        let token = await AsyncStorage.getItem(AuthToken);

        if (!token) {
            throw notLogged;
        }

        let options = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
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

export {BaseModel as default};