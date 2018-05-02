'use strict';

var assert = require('assert');
var config = require('../../lib/utils/config');
var mysql = require('mysql2');

var Utils = require('../../../controller/utils');

var connection, utils;
var creds = config.credentials.database;

describe('Util Functionalities', function() {
	before(function(done) {
		connection = mysql.createConnection(creds);
		utils = new Utils(connection);
		connection.connect(done);
	});
    
	after(function(done) {
		connection.end(done);
	});

	describe('is logged in function', function() {
		it('check is logged in of a user', function(done) {
			utils.isLoggedIn('arri', function(err, result) {
				if (err) done(err);
				assert(!result, 'Result should not exist');
				done();
			});
		});
	});

	describe('clear session login function', function() {
		it('clear session login of a user', function(done) {
			utils.clearUserSession('arri', function(err, result) {
				assert(!err, 'Error should not exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});
	});

	describe('get member id function', function() {
		it('get member id of a valid username', function(done) {
			utils.getMemberId('arri', function(err, result) {
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
	});

	describe('get member username function', function() {
		it('get member username of a valid id', function(done) {
			utils.getMemberUsername(1, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
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
	});

	describe('is member function', function() {
		it('get a valid member', function(done) {
			utils.isMember(20, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});

		it('get an invalid member', function(done) {
			utils.isMember(0, function(err, result) {
				if (err) done(err);
				assert(!result, 'Result should not exist');
				done();
			});
		});
	});

	describe('get roles function', function() {
		it('get roles of a valid faculty member', function(done) {
			utils.getRoles(20, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});
        
		it('get roles of an invalid faculty member', function(done) {
			utils.getRoles(0, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});
	});
    
	describe('get member first name function', function() {
		it('get first name of a valid faculty member', function(done) {
			utils.getMemberFirstName(20, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});
        
		it('get first name of an invalid faculty member', function(done) {
			utils.getMemberFirstName(0, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});
	});
    
	describe('get member last name function', function() {
		it('get last name of a valid faculty member', function(done) {
			utils.getMemberLastName(20, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});
        
		it('get last name of an invalid faculty member', function(done) {
			utils.getMemberLastName(0, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});
	});
    
	describe('get member full name function', function() {
		it('get full name of a valid faculty member', function(done) {
			utils.getMemberFullName(20, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});
        
		it('get full name of an invalid faculty member', function(done) {
			utils.getMemberFullName(0, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});
	});

	describe('get member email function', function() {
		it('get member email of a valid faculty member', function(done) {
			utils.getMemberEmail(20, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});
        
		it('get member email of an invalid faculty member', function(done) {
			utils.getMemberEmail(0, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});
	});

	describe('get applicant names', function() {
		it('get all applicant names', function(done) {
			utils.getApplicantNames(true, done);
		});

		it('get all reviewed applicant names', function(done) {
			utils.getApplicantNames(done);
		});
	});

	describe('get university names', function() {
		it('get all university names', function(done) {
			utils.getUniversities(done);
		});
	});

	describe('get university descriptions', function() {
		it('get all university descriptions', function(done) {
			utils.getUniversityDescriptions(done);
		});
	});

	describe('get committee member name function', function(){
		it('return all committtee member names', function(done) {
			utils.getAllCommitteeMembers(function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});
	});

	describe('get professors name function', function(){
		it('return all professor names', function(done) {
			utils.getAllProfessors(function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});
	});

	describe('get field of interests function', function(){
		it('return all field of interests', function(done) {
			utils.getFieldOfInterests(function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});
	});

	describe('get gpa function', function(){
		it('return all gpas', function(done) {
			utils.getGPA(function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});
	});

	describe('get visa status function', function(){
		it('get visa status of an invalid app', function(done) {
			utils.getVisaStatus(0, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});

		it('get visa status of a valid app', function(done) {
			utils.getVisaStatus(1, function(err, result) {
				if (err) done (err);
				assert(result, 'Result should exist');
				done();
			});
		});
	});

	describe('build committee rank function', function(){
		it('build committee rank: > B', function(done) {
			utils.buildCommitteeRankFilter('>', 'B', function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});

		it('build committee rank with invalid grade', function(done) {
			utils.buildCommitteeRankFilter('>', 'G', function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should exist');
				done();
			});
		});
	});
});
