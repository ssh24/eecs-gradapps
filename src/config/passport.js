'use strict';

var config = require('./database');
var mysql = require('mysql2');

// load all the things we need
var LocalStrategy  = require('passport-local').Strategy;

// load up the user model
var USER = require('../model/user');
var Utils = require('../controller/utils');
var Authentication = require('../controller/auth');

var creds = config;
var connection = mysql.createConnection(creds);
connection.connect();
var auth = new Authentication(connection);
var utils = new Utils(connection);
var User = new USER(connection);

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
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req, username, password, done) {
		User.findUser(username, function(err, user) {
			if (err) return done(null, false, req.flash('loginMessage', 
				'Fatal Error: ' + err.message));

			if (!user)
				return done(null, false, req.flash('loginMessage', 
					'Invalid username. Please try again.'));

			User.validPassword(username, password, function(err, isValid) {
				if (err) return done(null, false, req.flash('loginMessage', 
					'Fatal Error: ' + err.message));
				else {
					if (!isValid) {
						return done(null, false, req.flash('loginMessage', 
							'Invalid password. Please try again.'));
					} else {
						utils.getMemberId(username, function(err, id) {
							if (err) return done(null, false, req.flash('loginMessage', 
								'Fatal Database Error: ' + err.message));
							auth.logIn(id, function(err) {
								if (err) return done(null, false, req.flash('loginMessage', 
									'Account locked due to user "' + username + '" not logging ' + 
								'out properly.\nPlease contact the system administrator ' + 
								'for help.'));
								return done(null, username);
							});
						});
					}
				}
			});
		});
	}));

	passport.use('local-signup', new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req, username, password, done) {
		User.findUser(username, function(err, result) {
			if (err) return done(null, false, req.flash('signupMessage', 
				'Fatal Error: ' + err.message));
			else if (result) return done(null, false, req.flash('signupMessage', 
				'User with username "' + username + '" already exists.'));
			else {
				var options = {
					fname: req.body.f_name,
					lname: req.body.l_name,
					email: req.body.email,
					username: username,
					password: password
				};
				auth.signUp(options, function(err, result) {
					if (err) return done(null, false, req.flash('signupMessage', 
						'Fatal Database Error: ' + err.message));
					else if (result) {
						return done(null, result, req.flash('signupMessage', 
							'User "' + username + '" has been registered. Please contact the system administrator to get roles assigned.'));
					} else {
						err = new Error('Sign up failure. Please contact the system administrator for more help.');
						return done(null, false, req.flash('signupMessage', err.message));
					}
				});
			}
		});
	}));
};
