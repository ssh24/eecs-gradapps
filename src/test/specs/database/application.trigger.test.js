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

	describe('get all applications', function() {
		it('get all applications available in the portal as a professor', 
			function(done) {
				application.getApplications(null, 20, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
			});

		it('get all applications available in the portal as an admin', 
			function(done) {
				application.getApplications(null, 1, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
			});

		it('get all applications available in the portal as a committee member', 
			function(done) {
				application.getApplications(null, 10, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('get all applications available in the portal as a not logged in member', 
			function(done) {
				application.getApplications(null, 11, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});
	});

	describe('update interest status', function() {
		it('set interested status as an admin', function(done) {
			application.updateInterestedStatus(1, 1, 1, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});

		it('set interested status as a committee member', function(done) {
			application.updateInterestedStatus(1, 10, 1, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});

		it('set interested status as a professor', function(done) {
			application.updateInterestedStatus(1, 20, 1, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});

		it('unset interested status as an admin', function(done) {
			application.updateInterestedStatus(1, 1, 0, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should exist');
				done();
			});
		});

		it('unset interested status as a committee member', function(done) {
			application.updateInterestedStatus(1, 10, 0, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should exist');
				done();
			});
		});

		it('unset interested status as a professor', function(done) {
			application.updateInterestedStatus(1, 20, 0, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});
	});

	describe('update contacted status', function() {
		it('set contacted status as an admin', function(done) {
			application.updateContactedStatus(1, 1, 'somename', 1, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
		});

		it('set contacted status as a committee member', function(done) {
			application.updateContactedStatus(1, 10, 'somename', 1, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
		});

		it('set contacted status as a professor', function(done) {
			application.updateContactedStatus(1, 20, 'John Doe', 1, 
				function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
		});

		it('unset contacted status as an admin', function(done) {
			application.updateContactedStatus(1, 1, 'somename', 0, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
		});

		it('unset contacted status as a committee member', function(done) {
			application.updateContactedStatus(1, 10, 'somename', 0, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
		});

		it('unset contacted status as a professor', function(done) {
			application.updateContactedStatus(1, 20, 'John Doe', 0, 
				function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
		});

		it('set contacted status to an already contacted applicant', 
			function(done) {
				application.updateContactedStatus(1, 20, 'John Doe', 1, 
					function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						application.updateContactedStatus(1, 20, 'John Doe', 1, 
							function(err, result) {
								assert(err, 'Error should exist');
								assert(!result, 'Result should exist');
								done();
							});
					});
			});

		it('unset contacted status to an already uncontacted applicant', 
			function(done) {
				application.updateContactedStatus(1, 20, 'John Doe', 0, 
					function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						application.updateContactedStatus(1, 20, 'John Doe', 0, 
							function(err, result) {
								assert(err, 'Error should exist');
								assert(!result, 'Result should exist');
								done();
							});
					});
			});

		it('set contacted status to an invalid application', 
			function(done) {
				application.updateContactedStatus(0, 20, 'John Doe', 1, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should exist');
						done();
					});
			});

		it('unset contacted status to an invalid application', 
			function(done) {
				application.updateContactedStatus(0, 20, 'John Doe', 0, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should exist');
						done();
					});
			});
	});

	describe('update requested status', function() {
		it('set requested status as an admin', function(done) {
			application.updateRequestedStatus(1, 1, 'somename', 1, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
		});

		it('set requested status as a committee member', function(done) {
			application.updateRequestedStatus(1, 10, 'somename', 1, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
		});

		it('set requested status as a professor', function(done) {
			application.updateRequestedStatus(1, 20, 'John Doe', 1, 
				function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
		});

		it('unset requested status as an admin', function(done) {
			application.updateRequestedStatus(1, 1, 'somename', 0, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
		});

		it('unset requested status as a committee member', function(done) {
			application.updateRequestedStatus(1, 10, 'somename', 0, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
		});

		it('unset requested status as a professor', function(done) {
			application.updateRequestedStatus(1, 20, 'John Doe', 0, 
				function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
		});

		it('set requested status to an already requested applicant', 
			function(done) {
				application.updateRequestedStatus(1, 20, 'John Doe', 1, 
					function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						application.updateRequestedStatus(1, 20, 'John Doe', 1, 
							function(err, result) {
								assert(err, 'Error should exist');
								assert(!result, 'Result should exist');
								done();
							});
					});
			});

		it('unset requested status to an already uncontacted applicant', 
			function(done) {
				application.updateRequestedStatus(1, 20, 'John Doe', 0, 
					function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						application.updateRequestedStatus(1, 20, 'John Doe', 0, 
							function(err, result) {
								assert(err, 'Error should exist');
								assert(!result, 'Result should exist');
								done();
							});
					});
			});

		it('set requested status to an invalid application', 
			function(done) {
				application.updateRequestedStatus(0, 20, 'John Doe', 1, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should exist');
						done();
					});
			});

		it('unset requested status to an invalid application', 
			function(done) {
				application.updateRequestedStatus(0, 20, 'John Doe', 0, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should exist');
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

	describe('get an applicants review', function() {
		it('valid application as a admin', function(done){
			application.getApplicationReview(1,1,function(err,result){
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});

		it('valid application as a committee member', function(done){
			application.getApplicationReview(1,10,function(err,result){
				assert(err, 'Error should exist');
				assert(!result, 'Result shouldn\'t exist');
				done();
			});
		});

		it('valid application as a professor', function(done){
			application.getApplicationReview(1,20,function(err,result){
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});
		it('invalid application as a admin', function(done){
			application.getApplicationReview(20,1,function(err,result){
				assert(err, 'Error should exist');
				assert(!result, 'Result shouldn\'t exist');
				done();
			});
		});

		it('invalid application as a committee member', function(done){
			application.getApplicationReview(20,10,function(err,result){
				assert(err, 'Error should exist');
				assert(!result, 'Result shouldn\'t exist');
				done();
			});
		});

		it('invalid application as a professor', function(done){
			application.getApplicationReview(20,20,function(err,result){
				assert(err, 'Error should exist');
				assert(!result, 'Result shouldn\'t exist');
				done();
			});
		});
	});
});
