let express = require('express');
let mailer = require('express-mailer');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
let passport = require('passport');
let customResponses = require('express-custom-response');

const databaseUri = 'mongodb://192.168.99.100:27017/shank'; //docker macOs enviroment
// const databaseUri = 'mongodb://docker.com:27017/shank'; chino enviroment

mongoose.connect(databaseUri, {useMongoClient: true})
    .then(() => console.log(`Database connected at ${databaseUri}`))
    .catch(err => console.log(`Database connection error: ${err.message}`));

customResponses(path.join(__dirname, '/modules/responses'));

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//Por defecto es jade
//app.set('view engine', 'jade');

//Para que renderice html
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
//access images from client and app uploads/
app.use(express.static(path.join(__dirname, 'public')));

//Enable CORS (Cross Origin Request Sharing)
//http://code.tutsplus.com/tutorials/token-based-authentication-with-angularjs-nodejs--cms-22543
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

//Load modules
require('./modules/load.modules')(app);

//execute client
app.use('/', express['static'](__dirname + '/../web/dist'));

//https://www.sitepoint.com/user-authentication-mean-stack/
// [SH] Bring in the Passport config after model is defined
require('./config/passport');

// [SH] Initialise Passport before using the route middleware
app.use(passport.initialize());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {

        // Catch unauthorised errors JWT
        //console.log(err, '********************');

        if (err.code === 'invalid_token') {
            return res.unauthorized(err.status);
        }

        if (err.code === 'permission_denied') {
            return res.forbidden(err.status);
        }

        res.status(err.status || 500).json({response: {}, error: err.message});
    });
}

// production error handler
// no stacktraces leaked to users
app.use(function (err, req, res, next) {

    // Catch unauthorised errors JWT
    if (err.code === 'invalid_token') {
        return res.status(err.status).json({response: {}, error: 'Usuario no autorizado'});
    }

    if (err.code === 'permission_denied') {
        return res.status(err.status).json({response: {}, error: 'Permiso denegado'});
    }

    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;


