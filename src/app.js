'use strict';

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var favicon = require('serve-favicon');
var flash = require('connect-flash');
var morgan = require('morgan');
var ms = require('ms');
var passport = require('passport');
var path = require('path');
var session = require('express-session');

var MySQLStore = require('express-mysql-session')(session);

var app = express();
var creds = require('./config/database');
var sessionStore = new MySQLStore(creds);

require('./config/passport')(passport); // pass passport for configuration

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
// get information from html forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'image', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

var sess = { 
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
	rolling: true,
	secret: 'ilovescotchscotchyscotchscotch',
	cookie: { maxAge: ms('15m') }
};
  
if (app.get('env') === 'production') {
	app.set('trust proxy', 1); // trust first proxy
	sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess)); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
