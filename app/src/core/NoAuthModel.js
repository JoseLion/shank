/**
 * Created by MnMistake on 9/27/2017.
 */
'use strict';

import React from 'react';

import { ApiHost } from '../config/variables';

let internetError = 'No internet connection available.';
let requestServerError = 'We couldn\'t connect to the server. Please try later';
let parsingResponseError = 'Error getting server response.';

let NoAuthModel = {

    async get(resource) {

        let options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
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

    async create(resource, params) {

        const data = JSON.stringify(params);

        let options = {
            method: 'POST',
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