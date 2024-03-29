'use strict';

var mysql = require('mysql2');
var creds = require('../config/database');
var connection = mysql.createConnection(creds);
connection.connect();

var Application = require('../controller/application');
var Faculty_Member = require('../controller/fm');
var Review = require('../controller/review');
var Utils = require('../controller/utils');

var application = new Application(connection);
var fm = new Faculty_Member(connection);
var review = new Review(connection);
var utils = new Utils(connection);

module.exports = function(app, passport) {

	// index page route
	require('./index.js')(app);

	// login and logout page route
	require('./auth.js')(app, passport, [isLoggedIn]);

	// roles page route
	require('./roles.js')(app, [isLoggedIn]);

	// user settings route
	require('./settings.js')({app: app, utils: utils, fm: fm}, 
		[isLoggedIn, hasRole]);
    
	// admin page route
	require('./admin.js')({app: app, utils: utils, application: application, 
		fm: fm, review: review}, [isLoggedIn, hasRole]);
	// committee page route
	require('./committee.js')(app, utils, application, fm, [isLoggedIn, hasRole]);	
	// professor page route
	require('./professor.js')(app, utils, application, fm, [isLoggedIn, hasRole]);
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}

function hasRole(req, res, next) {
	if (req.path.indexOf('admin') > -1) {
		utils.hasRole(req.user.id, 'Admin', checkRole);
	} else if (req.path.indexOf('professor') > -1) {
		utils.hasRole(req.user.id, 'Professor', checkRole);
	} else if (req.path.indexOf('committee') > -1) {
		utils.hasRole(req.user.id, 'Committee Member', checkRole);
	} else {
		next();
	}

	function checkRole(err, hasRole) {
		if (err) next(err);
		if (hasRole) next(err, hasRole);
		else res.redirect('/roles');
	}
}
