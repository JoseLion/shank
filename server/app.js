let express = require('express'),
    mailer = require('express-mailer'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    customResponses = require('express-custom-response'),
    cors = require('cors');

let app = express();

const databaseUri = 'mongodb://shank.levelaptesting.com:27017/shank';
mongoose.Promise = global.Promise;
mongoose.connect(databaseUri, {databaseUri: true})
.then(() => console.log(`Database connected at ${databaseUri}`))
.catch(err => console.log(`Database connection error: ${err.message}`));

customResponses(path.join(__dirname, '/modules/responses'));

app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, content-type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

require('./modules/load.modules')(app);

app.use('/', express['static'](__dirname + '/../web/dist'));

require('./config/passport');

app.use(passport.initialize());

app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {

    if (err.code === 'invalid_token') {
      return res.unauthorized(err.status);
    }

    if (err.code === 'permission_denied') {
      return res.forbidden(err.status);
    }

    res.status(err.status || 500).json({response: {}, error: err.message});
  });
}

app.use(function (err, req, res, next) {
  if (err.code === 'invalid_token') { return res.status(err.status).json({response: {}, error: 'User not authorized'}); }
  if (err.code === 'permission_denied') { return res.status(err.status).json({response: {}, error: 'Permission denied'}); }

  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
