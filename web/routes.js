let clientCalls = require('./src/services/clientCalls');
require('es6-promise').polyfill();
require('isomorphic-fetch');

function initialize(app){

	//These are the API end points that you can write.

	//Setting up an event listener for GET request to '/' 
	app.get('/', function(req, res){ 
		console.log('request to / received');
        res.render('dashboard.html');		
	});

	//Routes for rendering original adminlte pages

    app.get('/adminlte/index.html', function(req, res){
        res.render('adminlte-pages/index.html');
    });

    app.get('/adminlte/index2.html', function(req, res){
        res.render('adminlte-pages/index2.html');
    });


    /*Routes for rendering pages in reactjs.
    After creating a page in react, define a route for it here 
    */

    app.get('/widgets.html', function(req, res){
        res.render('widgets.html');
    });

    app.get('/buttons.html', function(req, res){
        res.render('buttons.html');
    });

    app.get('/UI/general.html', function(req, res){
        res.render('general.html');
    });

    app.get('/timeline.html', function(req, res){
        res.render('timeline.html');
    });

    app.get('/login', function(req, res){ 
        res.render('login.html');		
    });

    app.post('/login', function(req, res){ 
        let data = req.body;

        clientCalls.create('login', {
            email: data.email,
            password: data.password,
        }).then((login) => {
          console.log("login cpost")
          console.log(login)
        })
            .catch((error) => {
                console.log(error)
            });
	});
}

exports.initialize = initialize;