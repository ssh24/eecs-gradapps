'use strict';

var assert = require('assert');
var config = require('../../lib/utils/config');
var mysql = require('mysql2');

var User = require('../../../model/user');

var user, connection;

var creds = config.credentials.database;
var fakeUser = config.credentials.signup;

describe('User Model', function() {
	before(function overallSetup(done) {
		connection = mysql.createConnection(creds);
		user = new User(connection);
		connection.connect(done);
	});

	after(function overallCleanUp(done) {
		connection.end(done);
	});
    
	it('create a new user', function(done) {
		user.createUser(fakeUser.username, fakeUser.password, 
			function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
	});

	it('create a user who already exists', function(done) {
		user.createUser(config.credentials.app.username, config.credentials.app.password, 
			function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
	});
    
	it('check for valid password', function(done) {
		user.validPassword(fakeUser.username, fakeUser.password, 
			function(err, isValid) {
				if (err) done(err);
				assert(isValid, 'Password should be valid');
				done();
			});
	});

	it('check for invalid password', function(done) {
		user.validPassword(fakeUser.username, '', 
			function(err, isValid) {
				if (err) done(err);
				assert(!isValid, 'Password should not be valid');
				done();
			});
	});

	it('check for valid password for an invalid user', function(done) {
		user.validPassword('', fakeUser.password, 
			function(err, isValid) {
				assert(err, 'Error should exist');
				assert(!isValid, 'Result should not exist');
				done();
			});
	});
    
	it('find a valid user', function(done) {
		user.findUser(fakeUser.username, function(err, result) {
			if (err) done(err);
			assert(result, 'Result should exist');
			done();
		});
	});
    
	it('remove a valid user', function(done) {
		user.removeUser(fakeUser.username, function(err, result) {
			if (err) done(err);
			assert(result, 'Result should exist');
			done();
		});
	});

	it('remove an invalid user', function(done) {
		user.removeUser('', function(err, result) {
			assert(err, 'Error should exist');
			assert(!result, 'Result should not exist');
			done();
		});
	});
});
