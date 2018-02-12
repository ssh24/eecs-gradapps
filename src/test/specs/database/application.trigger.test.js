'use strict';

var assert = require('assert');
var async = require('async');
var config = require('../../lib/utils/config');
var mysql = require('mysql2');

var Application = require('../../../controller/application');
var Auth = require('../../../controller/auth');

var application, auth, connection;
var creds = config.credentials.database;

describe('Application Triggers', function() {
	before(function overallSetup(done) {
		connection = mysql.createConnection(creds);
		application = new Application(connection);
		auth = new Auth(connection);
		async.series([
			function(callback) {
				connection.connect(callback);
			},
			function(callback) {
				auth.logIn(1, callback);
			},
			function(callback) {
				auth.selectRole(1, 'Admin', callback);
			}
		], done);
	});
    
	after(function overallCleanUp(done) {
		async.series([
			function(callback) {
				auth.logOut(1, callback);
			},
			function(callback) {
				connection.end(callback);
			}
		], done);
	});

	describe('mark an application seen', function() {
		before(function setUp(done) {
			async.series([
				function(callback) {
					auth.logIn(7, callback);
				},
				function(callback) {
					auth.logIn(10, callback);
				},
				function(callback) {
					auth.selectRole(7, 'Professor', callback);
				},
				function(callback) {
					auth.selectRole(10, 'Committee Member', callback);
				}
			], done);
		});

		after(function cleanUp(done) {
			async.series([
				function(callback) {
					auth.logOut(7, callback);
				},
				function(callback) {
					auth.logOut(10, callback);
				}
			], done);
		});

		it('not reviewed application', function(done) {
			application.markApplicationSeen(24, 1, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});

		it('valid application with a admin', 
			function(done) {
				application.markApplicationSeen(15, 1, 
					function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						done();
					});
			});

		it('valid application with a professor', 
			function(done) {
				application.markApplicationSeen(15, 7, 
					function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						done();
					});
			});

		it('valid application with a committee member',
			function (done) {
				application.markApplicationSeen(15, 10,
					function (err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
			});

		it('valid application with an invalid faculty member',
			function (done) {
				application.markApplicationSeen(20, 0,
					function (err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
			});

		it('invalid application with a valid faculty member',
			function (done) {
				application.markApplicationSeen(0, 20,
					function (err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
			});

		it('invalid application with an invalid faculty member',
			function (done) {
				application.markApplicationSeen(0, 0,
					function (err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
			});
	});
});
