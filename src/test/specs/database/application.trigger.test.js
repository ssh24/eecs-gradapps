'use strict';

var assert = require('assert');
var config = require('../../lib/utils/config');
var fs = require('fs');
var mysql = require('mysql2');
var path = require('path');

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

	describe('managing applications', function() {
		var file = fs.readFileSync(path.resolve(__dirname, '..', '..', 'lib', 'data', 'correct-sample.pdf'));
		var student = {
			app_file: file,
			app_Session: 'Winter',
			student_Id: '123456789',
			LName: 'Bar',
			FName: 'Foo',
			Email: 'foo@bar.com',
			Gender: 'M',
			GPA: 'B+',
			GPA_FINAL: 0,
			GRE: '130/6.5/140',
			TOEFL: 65,
			IELTS: 7.5,
			YELT: 3,
			VStatus: 'Visa',
			Degree: 'PhD',
			FOI: JSON.stringify(['Artificial Intelligence','Biomedical Engineering']),
			prefProfs: JSON.stringify(['Aijun An', 'Amir Sodagar']),
			ygsAwarded: 0
		};

		describe('create an application', function() {
			var insertId;
			var memberId = 1;
			after(function cleanUp(done) {
				application.deleteApplication(insertId, memberId, done);
			});
	
			it('create an application as invalid member', function(done) {
				application.createApplication({data: 'data'}, 0, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});
	
			it('create an application as incorrect member', function(done) {
				application.createApplication({data: 'data'}, 4, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});
	
			it('create an application with invalid data', function(done) {
				application.createApplication({data: 'data'}, memberId, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
			});
	
			it('create an application with valid data', function(done) {
				application.createApplication(student, memberId, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					insertId = result['insertId'];
					done();
				});
			});
		});

		describe('update an application', function() {
			var insertId;
			var memberId = 1;

			var newData = {
				app_Session: 'Winter',
				GPA: 'A'
			};

			before(function setUp(done) {
				application.createApplication(student, memberId, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					insertId = result['insertId'];
					done();
				});
			});

			after(function cleanUp(done) {
				application.deleteApplication(insertId, memberId, done);
			});
	
			it('update an application as invalid member', function(done) {
				application.updateApplication({data: 'data'}, insertId, 0, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
			});
	
			it('update an application as incorrect member', function(done) {
				application.updateApplication({data: 'data'}, insertId, 4, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
			});
	
			it('update an application with invalid data', function(done) {
				application.updateApplication({data: 'data'}, insertId, memberId, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
			});

			it('update an invalid application', function(done) {
				application.updateApplication({data: 'data'}, 0, memberId, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
			});
	
			it('update an application with valid data', function(done) {
				application.updateApplication(newData, insertId, memberId, 
					function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						done();
					});
			});
		});

		describe('delete an application', function() {
			var insertId;
			var memberId = 1;

			before(function setUp(done) {
				application.createApplication(student, memberId, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					insertId = result['insertId'];
					done();
				});
			});
	
			it('delete an application as invalid member', function(done) {
				application.deleteApplication(insertId, 0, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
			});
	
			it('delete an application as incorrect member', function(done) {
				application.deleteApplication(insertId, 4, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
			});

			it('delete an invalid application', function(done) {
				application.deleteApplication(0, memberId, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
			});
	
			it('delete an application with valid data', function(done) {
				application.deleteApplication(insertId, memberId, 
					function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						done();
					});
			});
		});

		describe('get application file', function() {
			var insertId;
			var memberId = 1;

			before(function setUp(done) {
				application.createApplication(student, memberId, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					insertId = result['insertId'];
					done();
				});
			});

			after(function cleanUp(done) {
				application.deleteApplication(insertId, memberId, done);
			});

			it('get application file as invalid member', function(done) {
				application.getApplicationFile(insertId, 0, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
			});
	
			it('get application file as incorrect member', function(done) {
				application.getApplicationFile(insertId, 4, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
			});
	
			it('get application file with valid data', function(done) {
				application.getApplicationFile(insertId, memberId, 
					function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						done();
					});
			});
		});

		describe('get application data', function() {
			var insertId;
			var memberId = 1;

			before(function setUp(done) {
				application.createApplication(student, memberId, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					insertId = result['insertId'];
					done();
				});
			});

			after(function cleanUp(done) {
				application.deleteApplication(insertId, memberId, done);
			});

			it('get application data as invalid member', function(done) {
				application.getApplicationData(insertId, 0, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
			});
	
			it('get application data as incorrect member', function(done) {
				application.getApplicationData(insertId, 4, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
			});
	
			it('get application data with valid data', function(done) {
				application.getApplicationData(insertId, memberId, 
					function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						done();
					});
			});
		});
	});
});
