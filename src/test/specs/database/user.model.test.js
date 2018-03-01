'use strict';

var assert = require('assert');
var config = require('../../lib/utils/config');

var User = require('../../../model/user');

var user;

var fakeUser = config.credentials.signup;

describe('User Model', function() {
	before(function overallSetup() {
		user = new User();
	});
    
	it('create a new user', function(done) {
		user.createUser(fakeUser.username, fakeUser.password, 
			function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
	});
    
	it('check if a password for ther user is valid', function() {
		var isValid = user.validPassword(fakeUser.username, fakeUser.password);
		assert(isValid, 'Password should be valid');
	});
    
	it('find a user', function(done) {
		user.findUser(fakeUser.username, function(err, result) {
			if (err) done(err);
			assert(result, 'Result should exist');
			done();
		});
	});
    
	it('remove a user', function(done) {
		user.removeUser(fakeUser.username, function(err, result) {
			if (err) done(err);
			assert(result, 'Result should exist');
			done();
		});
	});
});
