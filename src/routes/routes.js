'use strict';

var mysql = require('mysql2');
var creds = require('../config/database');
var connection = mysql.createConnection(creds);
connection.connect();

var Utils = require('../controller/utils');
var utils = new Utils(connection);

module.exports = function(app, passport) {
	// home page route
	app.get('/', function(req, res) {
		res.render('index', { title: 'Welcome to Grad Apps', user: null, 
			role: null});
	});
    
	/** LOGIN PAGE ROUTE */
	app.get('/login', function(req, res) {
		res.render('login', { message: req.flash('loginMessage'), title: 'Login', 
			user: null, 
			role: null});
	});
    
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/roles', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// roles page route
	app.get('/roles', isLoggedIn, function(req, res) {
		var userInfo = req.user;
		res.render('roles', { 
			title: 'Role Selection',
			confirmation: 'You have been successfully logged into the system.',
			user: userInfo.id,
			roles: userInfo.roles, 
			fname: userInfo.fname,
			role: null
		});
	});
    
	// admin page route
	app.get('/roles/admin', [isLoggedIn, hasRole], function(req, res) {
		var userInfo = req.user;
		var role = 'Admin';
		res.render(role, { 
			title: 'Welcome ' + role,
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role
		});
	});
    
	// professor page route
	app.get('/roles/professor', [isLoggedIn, hasRole], function(req, res) {
		var userInfo = req.user;
		var role = 'Professor';
		res.render(role, { 
			title: 'Welcome ' + role,
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role
		});
	});
    
	// committee page route
	app.get('/roles/committee', [isLoggedIn, hasRole], function(req, res) {
		var userInfo = req.user;
		var role = 'Committee Member';
		res.render('Committee', { 
			title: 'Welcome ' + role,
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role
		});
	});
    
	// logout page route
	app.get('/logout', [isLoggedIn], function(req, res) {
		req.session.destroy(function () {
			res.redirect('/');
		});
	});
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
