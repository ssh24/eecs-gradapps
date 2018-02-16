'use strict';

var assert = require('assert');
var config = require('../../lib/utils/config');
var mysql = require('mysql2');

var Authentication = require('../../../controller/auth');
var Utils = require('../../../controller/utils');

var auth, connection, utils;
var creds = config.credentials.database;

describe('Authentication Triggers', function() {
	before(function(done) {
		connection = mysql.createConnection(creds);
		auth = new Authentication(connection);
		utils = new Utils(connection);
		connection.connect(done);
	});
    
	after(function(done) {
		connection.end(done);
	});

	it('get member id of a valid username', function(done) {
		utils.getMemberId('arri', function(err, result) {
			if (err) done(err);
			assert(result, 'Result should exist');
			done();
		});
	});

	it('get member username of a valid id', function(done) {
		utils.getMemberUsername(1, function(err, result) {
			if (err) done(err);
			assert(result, 'Result should exist');
			done();
		});
	});

	it('get member id of an invalid username', function(done) {
		utils.getMemberId('some_id', function(err, result) {
			assert(err, 'Error should exist');
			assert(!result, 'Result should not exist');
			done();
		});
	});

	it('get member username of an invalid id', function(done) {
		utils.getMemberUsername(0, function(err, result) {
			assert(err, 'Error should exist');
			assert(!result, 'Result should not exist');
			done();
		});
	});

	it('check if a valid member is logged in', function(done) {
		utils.isLoggedIn(1, function(err, result) {
			if (err) done(err);
			assert(!result, 'Member is not logged in');
			done();
		}); 
	});
    
	it('check if an invalid member is logged in', function(done) {
		utils.isLoggedIn(0, function(err, result) {
			assert(err, 'Error should exist');
			assert(!result, 'Result should not exist');
			done();
		}); 
	});

	describe('login', function() {
		after(function cleanUp(done) {
			auth.logOut(20, done);
		});

		it('login as a valid member', function(done) {
			auth.logIn(20, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});

		it('login as an already logged in member', function(done) {
			auth.logIn(20, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});

		it('login as an invalid member', function(done) {
			auth.logIn(0, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});
	});

	describe('select a role', function() {
		before(function setUp(done) {
			auth.logIn(20, done);
		});

		after(function cleanUp(done) {
			auth.logOut(20, done);
		});

		it('select a valid role', function(done) {
			auth.selectRole(20, 'Admin', function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});

		it('select an invalid role', function(done) {
			auth.selectRole(20, 'Some Role', function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});

		it('select a role as a not logged in member', function(done) {
			auth.selectRole(19, 'Professor', function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});
	});

	describe('logout', function() {
		before(function setUp(done) {
			auth.logIn(20, function(err) {
				if (err) done(err);
				auth.selectRole(20, 'Professor', done);
			});
		});

		it('logout as a valid member', function(done) {
			auth.logOut(20, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});

		it('logout a not logged in member', function(done) {
			auth.logOut(20, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});

		it('logout as an invalid member', function(done) {
			auth.logOut(0, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});
	});
});
