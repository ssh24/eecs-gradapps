'use strict';

var assert = require('assert');
var async = require('async');
var config = require('../../lib/utils/config');
var mysql = require('mysql2');

var Auth = require('../../../controller/auth');
var Member = require('../../../controller/member');
var Utils = require('../../../controller/utils');

var auth, connection, member, utils;
var creds = config.credentials.database;

describe('Member Triggers', function() {
	before(function overallSetup(done) {
		connection = mysql.createConnection(creds);
		member = new Member(connection);
		auth = new Auth(connection);
		utils = new Utils(connection);
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
    
	describe('Remove a member', function() {
		var newMemberId;
        
		before(function setUp(done) {
			async.series([
				function(callback) {
					auth.signUp(config.credentials.signup, callback);
				},
				function(callback) {
					utils.getMemberId(config.credentials.signup.username, 
						function(err, id) {
							if (err) callback(err);
							newMemberId = id;
							callback();
						});
				},	
				function(callback) {
					auth.logIn(20, callback);
				},
				function(callback) {
					auth.selectRole(20, 'Professor', callback);
				}
			], done);
		});
        
		after(function cleanUp(done) {
			auth.logOut(20, done);
		});
        
		it('remove a valid member as a valid admin', function(done) {
			member.removeMember(1, newMemberId, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				assert.equal(result, true, 'Member should be removed');
				done();
			});
		});
        
		it('remove an invalid member as a valid admin', function(done) {
			member.removeMember(1, -1, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});
        
		it('remove an valid member as a invalid admin', function(done) {
			member.removeMember(20, newMemberId, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});
        
		it('remove an invalid member as a invalid admin', function(done) {
			member.removeMember(20, -1, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});
	});
});
