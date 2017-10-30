/**
 * Created by MnMistake on 9/27/2017.
 */
'use strict';

const Host = 'http://192.168.1.3:3000/';
const ApiHost = Host + 'api/';

let internetError = 'No internet connection available.';
let requestServerError = 'We couldn\'t connect to the server. Please try later';
let parsingResponseError = 'Error getting server response.';

require('es6-promise').polyfill();
require('isomorphic-fetch');

var request = require('request');

let clientCalls = {

    get(resource) {

        let options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        const response = fetch(ApiHost + resource, options).catch(
            error => {
                throw requestServerError;
            }
        );

        const json = response.json().catch(
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

    create(resource, params) {
        const data = JSON.stringify(params);

        request.post({url:ApiHost + resource, form: params,  headers: {  'Accept': 'application/json', 'Content-Type': 'application/json'}}, function(err,httpResponse,body){ 
         
            console.log("body")
            console.log(body)
            return body;
         })
    },

     update(resource, params) {

        const data = JSON.stringify(params);

        let options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: data
        }

        const response =  fetch(ApiHost + resource, options).catch(
            error => {
                throw requestServerError;
            }
        );

        const json =  response.json().catch(
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

     remove(resource) {

        let options = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        const response =  fetch(ApiHost + resource, options).catch(
            error => {
                throw requestServerError;
            }
        );
        const json =  response.json().catch(
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

module.exports = clientCalls