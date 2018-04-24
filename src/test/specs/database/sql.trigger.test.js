'use strict';

var assert = require('assert');
var config = require('../../lib/utils/config');
var mysql = require('mysql2');

var connection;
var creds = config.credentials.database;

describe('SQL Triggers', function() {
	before(function(done) {
		connection = mysql.createConnection(creds);
		connection.connect(done);
	});
    
	after(function(done) {
		connection.end(done);
	});
    
	describe('application_review', function() {
		it('insert trigger', function(done) {
			var app_id = 18;
			var committee_id = 13;
			var oldReview;
			connection.query('SELECT * from application where app_Id = ?', 
				[app_id], function(err, res) {
					if(err) done(err);
					assert(res);
					oldReview = res[0]['committeeReviewed'];
					connection.query('INSERT INTO `application_review` ' + 
                        '(`committeeId`, `appId`, `c_Rank`, `Status`) ' + 
                        'VALUES (?, ?, "B", "Submitted");', [committee_id, 
						app_id], function(err, res) {
						if(err) done(err);
						assert(res);
						connection.query('SELECT * from application where ' + 
                            'app_Id = ?', [app_id], function(err, res) {
							if(err) done(err);
							assert(res);
							var newReview = res[0]['committeeReviewed'];
							assert.notEqual(oldReview, newReview, 
								'Committee review is submitted');
							done();
						});
					});
				});
		});

		it('update trigger', function(done) {
			var app_id = 25;
			var committee_id = 18;
			var oldReview;
			connection.query('SELECT * from application where app_Id = ?', 
				[app_id], function(err, res) {
					if(err) done(err);
					assert(res);
					oldReview = res[0]['committeeReviewed'];
					connection.query('UPDATE `application_review` ' + 
                        'SET Status = "Submitted" WHERE appId = ? AND ' + 
                        'committeeId = ?', [app_id, committee_id], 
					function(err, res) {
						if(err) done(err);
						assert(res);
						connection.query('SELECT * from application where ' + 
                            'app_Id = ?', [app_id], function(err, res) {
							if(err) done(err);
							assert(res);
							var newReview = res[0]['committeeReviewed'];
							assert.notEqual(oldReview, newReview, 
								'Committee review is submitted');
							done();
						});
					});
				});
		});
	});

	describe('application_seen', function() {
		describe('insert trigger', function() {
			it('error case', function(done) {
				var app_id = 24;
				var prof_id = 5;
				connection.query('INSERT INTO `application_seen` ' + 
                '(`fmId`, `appId`, `seen`) VALUES (?, ?, 1);', 
				[prof_id, app_id], function(err, res) {
					assert(err, 'Error should exist');
					assert(!res, 'Result should not exist');
					done();
				});
			});

			it('non-error case', function(done) {
				var app_id = 25;
				var prof_id = 5;
				connection.query('INSERT INTO `application_seen` ' + 
                '(`fmId`, `appId`, `seen`) VALUES (?, ?, 1);', 
				[prof_id, app_id], function(err, res) {
					if(err) done(err);
					assert(res, 'Result should exist');
					done();
				});
			});
		});
        
		describe('update trigger', function() {
			it('error case', function(done) {
				var app_id = 20;
				var prof_id = 7;
				connection.query('UPDATE `application_seen` ' + 
                'SET seen = 1 WHERE fmId = ? AND appId = ?', 
				[prof_id, app_id], function(err, res) {
					assert(err, 'Error should exist');
					assert(!res, 'Result should not exist');
					done();
				});
			});

			it('non-error case', function(done) {
				var app_id = 15;
				var prof_id = 6;
				connection.query('UPDATE `application_seen` ' + 
                'SET seen = 1 WHERE fmId = ? AND appId = ?', 
				[prof_id, app_id], function(err, res) {
					if(err) done(err);
					assert(res, 'Result should exist');
					done();
				});
			});
		});
	});
});
