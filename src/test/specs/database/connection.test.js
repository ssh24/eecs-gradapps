'use strict';

var assert = require('assert');
var config = require('../../lib/utils/config');
var mysql = require('mysql2');

var connection;
var creds = config.credentials.database;

/*
** Test class for checking the connection
*/
describe('Connection Test', function() {
	afterEach(function(done) {
		connection.end(done);
	});

	// Check if connection succeeds with an invalid set of credentials
	it('connect with invalid creds', function(done) {
		var invalid_creds = {
			'host': 'localhost',
			'user': 'root1',
			'password': 'wrong_pass'
		};
        
		connection = mysql.createConnection(invalid_creds);
		connection.connect(function(err, result) {
			assert(err, 'Error should exist');
			assert(!result, 'Result should not exist');
			done();
		});
	});
	
	// Check if connection succeeds with a valid set of credentials
	it('connect with valid creds', function(done) {
		connection = mysql.createConnection(creds);
		connection.connect(function(err, result) {
			if(err) done(err);
			assert(result, 'Result should exist');
			done();
		});
	});
});
