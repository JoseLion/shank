let clientCalls = require('./src/services/clientCalls');
require('es6-promise').polyfill();
require('isomorphic-fetch');

const Host = 'http://192.168.1.3:3000/';
const ApiHost = Host + 'api/';

let internetError = 'No internet connection available.';
let requestServerError = 'We couldn\'t connect to the server. Please try later';
let parsingResponseError = 'Error getting server response.';

let request = require('request');

function initialize(app) {

    //These are the API end points that you can write.

    //Setting up an event listener for GET request to '/'
    app.get('/', function (req, res) {
        console.log('request to / received');
        res.render('dashboard.html');
    });

    //Routes for rendering original adminlte pages

    app.get('/adminlte/index.html', function (req, res) {
        res.render('adminlte-pages/index.html');
    });

    app.get('/adminlte/index2.html', function (req, res) {
        res.render('adminlte-pages/index2.html');
    });


    /*Routes for rendering pages in reactjs.
     After creating a page in react, define a route for it here
     */

    app.get('/widgets.html', function (req, res) {
        res.render('widgets.html');
    });

    app.get('/buttons.html', function (req, res) {
        res.render('buttons.html');
    });

    app.get('/UI/general.html', function (req, res) {
        res.render('general.html');
    });

    app.get('/timeline.html', function (req, res) {
        res.render('timeline.html');
    });

    app.get('/login', function (req, res) {
        res.render('login.html');
    });

    app.post('/login', function (req, res) {
        let data = req.body;
        request.post({
            url: ApiHost + 'login', form: {
                email: data.email,
                password: data.password,
            }, headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
        }, function (err, httpResponse, body) {
            if (err) {
                throw requestServerError;
            }

            let parsedResponse = JSON.parse(body);
            console.log("parsedResponse")
            console.log(parsedResponse)
            console.log(parsedResponse.error)

            if (!parsedResponse.error) {
                res.render('dashboard.html');
            }
            else {
                console.log(parsedResponse.error)
            }

            console.log("body")
            console.log(body)
            return body;
        })
    });

    app.get('/users', function (req, res) {
        res.render('userListing.html');
    });

    app.get('/invite/friend', function (req, res) {
        res.render('userListing.html');
    });
    app.post('/invite/friend', function (req, res) {
        res.render('userListing.html');
    });
}

exports.initialize = initialize;