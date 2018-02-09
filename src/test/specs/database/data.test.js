'use strict';

var _ = require('lodash');

var assert = require('assert');
var chai = require('chai');
var config = require('../../lib/utils/config');
var expect = chai.expect;
var mysql = require('mysql2');

var connection;
var creds = config.credentials.database;

/*
** Test class for testing the data seeded
*/
describe('Data Test', function() {
	before(function(done) {
		connection = mysql.createConnection(creds);
		connection.connect(done);
	});
    
	after(function(done) {
		connection.end(done);
	});

	describe('get all data', function() {
		it('faculty_member', function(done) {
			connection.query('SELECT * FROM faculty_member', 
				function(err, data) {
					if (err) done(err);
					assert(data, 'Data must exist');
					_.forEach(data, function(dt) {
						var roles = dt['fm_Roles'];
						assert(Array.isArray(roles), 
							'The roles should be in an array');
					});
					done();
				});
		});

		it('application', function(done) {
			connection.query('SELECT * FROM application', 
				function(err, data) {
					if (err) done(err);
					assert(data, 'Data must exist');
					_.forEach(data, function(dt) {
						var fois = dt['FOI'];
						var prefProfs = dt['prefProfs'];
						assert(Array.isArray(fois), 
							'The field of interests should be in an array');
						assert(Array.isArray(prefProfs), 
							'The preferred profs should be in an array');
					});
					done();
				});
		});

		it('application_review', function(done) {
			connection.query('SELECT * FROM application_review', 
				function(err, data) {
					if (err) done(err);
					assert(data, 'Data must exist');
					_.forEach(data, function(dt) {
						var status = dt['Status'];
						assert(['New', 'Draft', 'In-Progress', 'Reviewed', 
							'Submitted'].includes(status), 
						'Status should be one of them');
					});
					done();
				});
		});

		it('application_seen', function(done) {
			connection.query('SELECT * FROM application_seen', 
				function(err, data) {
					if (err) done(err);
					assert(data, 'Data must exist');
					_.forEach(data, function(dt) {
						var seen = dt['seen'];
						expect(seen).to.be.oneOf([0, 1]);
					});
					done();
				});
		});

		it('university', function(done) {
			connection.query('SELECT * FROM university', function(err, data) {
				if (err) done(err);
				assert(data, 'Data must exist');
				_.forEach(data, function(dt) {
					var assessments = dt['u_Assessments'];
					assert(Array.isArray(assessments), 
						'The assessments should be in an array');
				});
				done();
			});
		});

		it('field of interest', function(done) {
			connection.query('SELECT * FROM foi', function(err, data) {
				if (err) done(err);
				var foi = config.app.foi;
				assert(data, 'Data must exist');
				assert.equal(foi.length, data.length);
				_.forEach(data, function(dt) {
					assert(foi.includes(dt['field_Name']), 
						'Field of interest must exist');
				});
				done();
			});
		});
	});
});
