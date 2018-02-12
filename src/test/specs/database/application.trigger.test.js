'use strict';

var assert = require('assert');
var config = require('../../lib/utils/config');
var mysql = require('mysql2');

var Application = require('../../../controller/application');

var application, connection;
var creds = config.credentials.database;

describe('Application Triggers', function() {
	before(function overallSetup(done) {
		connection = mysql.createConnection(creds);
		application = new Application(connection);
		connection.connect(done);
	});
    
	after(function overallCleanUp(done) {
		connection.end(done);
	});

	describe('mark an application seen', function() {
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

	describe('get review applications', function() {
		it('get default review applications for valid member', function(done) {
			application.getReviewApplications(null, 16, function(err, result) {
				if(err) return done(err);
				assert(result, 'Result should exist');
				done();
			});
		});

		it('get default review applications for invalid member', function(done) {
			application.getReviewApplications(null, 0, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});

		it('get default review applications for valid member with no assigned reviews', 
			function(done) {
				application.getReviewApplications(null, 20, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});

		it('get default review applications for not committee member', function(done) {
			application.getReviewApplications(null, 3, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});
	});
});
