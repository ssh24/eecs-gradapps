'use strict';

// load all the things we need
var LocalStrategy  = require('passport-local').Strategy;

// load up the user model
var USER = require('../model/user');
var User = new USER();

var mysql = require('mysql2');
var creds = require('./database');
var connection = mysql.createConnection(creds);
connection.connect();

var Utils = require('../controller/utils');
var utils = new Utils(connection);

// expose this function to our app using module.exports
module.exports = function(passport) {
	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	// used to deserialize the user
	passport.deserializeUser(function(user, done) {
		var info = {};
		utils.getMemberId(user, function(err, id) {
			if (err) done(err);
			info.id = id;
			utils.getRoles(info.id, function(err, roles) {
				if (err) done(err);
				info.roles = roles;
				utils.getMemberFullName(info.id, function(err, fname) {
					if (err) done(err);
					info.fullname = fname;
					utils.getMemberFirstName(info.id, function(err, fname) {
						if (err) done(err);
						info.fname = fname;
						done(null, info);
					});
				});
			});
		});
	});

	passport.use('local-login', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, username, password, done) { // callback with username and password from our form
		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
		User.findUser(username, function(err, user) {
			// if there are any errors, return the error before anything else
			if (err)
				return done(err);

			// if no user is found, return the message
			if (!user)
				return done(null, false, req.flash('loginMessage', 
					'Invalid username. Please try again.')); // req.flash is the way to set flashdata using connect-flash

			// if the user is found but the password is wrong
			if (!User.validPassword(username, password))
				return done(null, false, req.flash('loginMessage', 
					'Invalid password. Please try again.')); // create the loginMessage and save it to session as flashdata
					
			utils.clearUserSession(user, function(err) {
				if (err) return done(err);
				return done(null, user);
			});
		});
	}));
};
