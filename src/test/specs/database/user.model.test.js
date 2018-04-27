'use strict';

var assert = require('assert');

var User = require('../../../model/user');

var user, user_data;

describe('User Model', function() {
	before(function overallSetup() {
		user = new User();
		user_data = {
			username: 'Foo',
			password: 'Bar'
		};
	});

	describe('createUser function', function() {
		after(function cleanUp(done) {
			user.removeUser(user_data.username, done);
		});
        
		it('create a user w/ an username and password', function(done) {
			user.createUser(user_data.username, user_data.password, 
				function(err, result) {
					if (err) done (err);
					assert(result, 'Result should exist');
					done();
				});
		});
        
		it('create a user w/ an existing username', function(done) {
			user.createUser('admin', user_data.password, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
		});
	});
    
	describe('updateUsername function', function() {
		var updatedUsername = 'Foo Change';

		before(function setUp(done) {
			user.createUser(user_data.username, user_data.password, done);
		});

		after(function cleanUp(done) {
			user.removeUser(updatedUsername, done);
		});
        
		it('update username of existing user', function(done) {
			user.updateUsername(user_data.username, updatedUsername, 
				function(err, result) {
					if (err) done (err);
					assert(result, 'Result should exist');
					done();
				});
		});
        
		it('update username of non-existing user', function(done) {
			user.updateUsername('abcd', updatedUsername, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
		});
	});
    
	describe('updatePassword function', function() {
		var updatedPassword = 'Bar Change';

		before(function setUp(done) {
			user.createUser(user_data.username, user_data.password, done);
		});

		after(function cleanUp(done) {
			user.removeUser(user_data.username, done);
		});
        
		it('update password of existing user', function(done) {
			user.updatePassword(user_data.username, updatedPassword, 
				function(err, result) {
					if (err) done (err);
					assert(result, 'Result should exist');
					done();
				});
		});
        
		it('update password of non-existing user', function(done) {
			user.updatePassword('abcd', updatedPassword, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
		});
	});
    
	describe('removeUser function', function() {
		before(function setUp(done) {
			user.createUser(user_data.username, user_data.password, done);
		});
        
		it('remove an exsiting user', function(done) {
			user.removeUser(user_data.username, function(err, result) {
				if (err) done (err);
				assert(result, 'Result should exist');
				done();
			});
		});
        
		it('remove a non-existing user', function(done) {
			user.removeUser('abcd', function(err, result) {
				if (err) done(err);
				assert(!result, 'Result should not exist');
				done();
			});
		});
	});
    
	describe('findUser function', function() {
		before(function setUp(done) {
			user.createUser(user_data.username, user_data.password, done);
		});
        
		after(function cleanUp(done) {
			user.removeUser(user_data.username, done);
		});
        
		it('find an exsiting user', function(done) {
			user.findUser(user_data.username, function(err, result) {
				if (err) done (err);
				assert(result, 'Result should exist');
				done();
			});
		});
        
		it('find a non-existing user', function(done) {
			user.findUser('abcd', function(err, result) {
				if (err) done(err);
				assert(!result, 'Result should not exist');
				done();
			});
		});
	});
    
	describe('getPassword function', function() {
		before(function setUp(done) {
			user.createUser(user_data.username, user_data.password, done);
		});

		after(function cleanUp(done) {
			user.removeUser(user_data.username, done);
		});
        
		it('get password of existing user', function(done) {
			user.getPassword(user_data.username, function(err, result) {
				if (err) done (err);
				assert(result, 'Result should exist');
				done();
			});
		});
        
		it('get password of non-existing user', function(done) {
			user.getPassword('abcd', function(err, result) {
				if (err) done (err);
				assert(!result, 'Result should not exist');
				done();
			});
		});
	});
    
	describe('validPassword function', function() {
		before(function setUp(done) {
			user.createUser(user_data.username, user_data.password, done);
		});

		after(function cleanUp(done) {
			user.removeUser(user_data.username, done);
		});
        
		it('validate password of existing user', function() {
			var valid = user.validPassword(user_data.username, user_data.password);
			assert(valid, 'Password should be valid');
		});
        
		it('validatte of non-existing user', function() {
			var valid = user.validPassword('abcd', user_data.password);
			assert(!valid, 'Password should not be valid');
		});
	});
});
