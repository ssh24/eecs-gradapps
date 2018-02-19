'use strict';

var async = require('async');
var assert = require('assert');
var config = require('../../lib/utils/config');
var mysql = require('mysql2');

var Authentication = require('../../../controller/auth');
var Utils = require('../../../controller/utils');

var auth, connection, utils;
var creds = config.credentials.database;

describe('Util Functionalities', function() {
	before(function(done) {
		connection = mysql.createConnection(creds);
		auth = new Authentication(connection);
		utils = new Utils(connection);
		connection.connect(done);
	});
    
	after(function(done) {
		connection.end(done);
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
    
	describe('unlock account function', function() {
		before(function(done) {
			async.series([
				function(callback) {
					auth.logIn(1, callback);
				},
				function(callback) {
					auth.logIn(19, callback);
				},
				function(callback) {
					auth.selectRole(19, 'Professor', callback);
				},
				function(callback) {
					auth.selectRole(1, 'Admin', callback);
				},
			], done);
		});
        
		after(function(done) {
			async.series([
				function(callback) {
					auth.logOut(1, callback);
				},
				function(callback) {
					auth.logOut(19, callback);
				}
			], done);
		});
        
		it('unlock a valid member account as a valid admin', function(done) {
			utils.unlockAccount(1, 21, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});
        
		it('unlock a invalid member account as a valid admin', function(done) {
			utils.unlockAccount(1, 0, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});
        
		it('unlock a invalid member account as a invalid admin', function(done) {
			utils.unlockAccount(18, 0, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});
        
		it('unlock a valid member account as a invalid admin', function(done) {
			utils.unlockAccount(18, 21, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});
        
		it('unlock a member account as an invalid logged in admin', 
			function(done) {
				utils.unlockAccount(19, 0, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
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

	describe('get applicant names function', function(){
		it('return all applicant names', function(done) {
			utils.getApplicantNames(function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});
	});
});
