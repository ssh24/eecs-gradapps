'use strict';

var assert = require('assert');
var config = require('../../lib/utils/config');
var mysql = require('mysql2');

var Application = require('../../../lib/application');

var connection, application;
var creds = config.credentials.database;

describe('Application Triggers', function() {
	before(function(done) {
		connection = mysql.createConnection(creds);
		connection.connect(done);
		application = new Application(connection);
	});
    
	after(function(done) {
		connection.end(done);
	});

	describe('mark an application seen', function() {
		it('valid application with a valid faculty member', 
			function(done) {
				application.markApplicationSeen(15, 7, 
					function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						done(err);
					});
			});

		it('valid application with a committee member', 
			function(done) {
				application.markApplicationSeen(15, 10, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
			});

		it('valid application with an invalid faculty member', 
			function(done) {
				application.markApplicationSeen(20, 0, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
			});

		it('invalid application with a valid faculty member', 
			function(done) {
				application.markApplicationSeen(0, 20, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
			});

		it('invalid application with an invalid faculty member', 
			function(done) {
				application.markApplicationSeen(0, 0, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
			});
	});
});
