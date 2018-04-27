'use strict';

process.env.NODE_ENV = 'test';

var assert = require('assert');
var config = require('../../lib/utils/config');
var mysql = require('mysql2');

var Faculty_Member = require('../../../controller/fm');

var connection, faculty_member;
var creds = config.credentials.database;

describe('Faculty Member Trigger', function() {
	before(function overallSetup(done) {
		connection = mysql.createConnection(creds);
		faculty_member = new Faculty_Member(connection);
		connection.connect(done);
	});

	after(function overallCleanUp(done) {
		connection.end(done);
	});

	describe('updatePreset function', function() {

		it('Add new preset with a valid role', function(done) {
			var options = {
				column_name: ['btn_col_name', 'btn_col_gender'],
				column_val: [2, 1],
				filter_name: ['btn_filter_visa'],
				filter_val: ['Visa']
			};
			faculty_member.updatePreset(20, 'Professor', 'New Preset!!!!', options, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist...');
				done();
			});
		});

		it('Add new preset with a unassigned role', function(done) {
			var options = {
				column_name: ['btn_col_name', 'btn_col_gender'],
				column_val: [2, 1],
				filter_name: ['btn_filter_visa'],
				filter_val: ['Visa']
			};
			faculty_member.updatePreset(1, 'Professor', 'New Preset!!!!', options, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});

		it('Update an existing preset with a valid role', function(done) {
			var options = {
				column_name: ['btn_col_name', 'btn_col_gender'],
				column_val: [1, 2],
				filter_name: ['btn_filter_visa'],
				filter_val: ['Domestic']
			};
			faculty_member.updatePreset(20, 'Professor', 'New Preset!!!!', options, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist...');
				done();
			});
		});

		it('Calling the function with an invalid role', function(done) {
			var options = {
				column_name: ['btn_col_name', 'btn_col_gender'],
				column_val: [2, 1],
				filter_name: ['btn_filter_visa'],
				filter_val: ['Visa']
			};
			faculty_member.updatePreset(12, 'Pudding', 'New Preset!!!!', options, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});
	});

	describe('getPreset function', function() {
		before(function setUp(done) {
			var options = {
				column_name: ['btn_col_name', 'btn_col_gender'],
				column_val: [2, 1],
				filter_name: ['btn_filter_visa'],
				filter_val: ['Visa']
			};
			faculty_member.updatePreset(1, 'Admin', 'New Preset!!!!', options, done);
		});
		it('Get preset from an assigned role', function(done) {
			faculty_member.getPresets(1, 'Admin', function(err, result) {
				assert(result, 'Result should exist');
				done();
			});
		});

		it('Get preset from an unassigned role', function(done) {
			faculty_member.getPresets(12, 'Admin', function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});

		it('Get preset from an invalid role', function(done) {
			faculty_member.getPresets(1, 'Pudding', function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should exist');
				done();
			});
		});
	});

	describe('getUserInfo function', function() {
		it('get member info as an admin', function(done) {
			faculty_member.getUserInfo(20, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});

		it('get member info as not an admin', function(done) {
			faculty_member.getUserInfo(4, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});

		it('get member info as an invalid member', function(done) {
			faculty_member.getUserInfo(0, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});
	});

	describe('createUser function', function() {
		var insertId;

		after(function cleanUp(done) {
			faculty_member.deleteUser(insertId, 20, done);
		});

		it('create a valid user as an admin', function(done) {
			faculty_member.createUser({fm_Username: 'foobar', fm_Lname: 'Bar', 
				fm_Fname: 'Foo'}, 20, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				insertId = result['insertId'];
				done();
			});
		});

		it('create an invalid user as an admin', function(done) {
			faculty_member.createUser({}, 20, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});

		it('create a valid user as not an admin', function(done) {
			faculty_member.createUser({fm_Username: 'foobar', fm_Lname: 'Bar', 
				fm_Fname: 'Foo'}, 4, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});

		it('create an invalid user as not an admin', function(done) {
			faculty_member.createUser({}, 4, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});

		it('create an user as an invalid member', function(done) {
			faculty_member.createUser({fm_Lname: 'Bar', fm_Fname: 'Foo'}, 0, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
		});
	});

	describe('updateUser function', function() {
		var insertId;

		before(function setUp(done) {
			faculty_member.createUser({fm_Username: 'foobar', fm_Lname: 'Bar', 
				fm_Fname: 'Foo'}, 20, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				insertId = result['insertId'];
				done();
			});
		});

		after(function cleanUp(done) {
			faculty_member.deleteUser(insertId, 20, done);
		});

		it('update a valid user as an admin', function(done) {
			faculty_member.updateUser({fm_Lname: 'Bar Changed', 
				fm_Fname: 'Foo Changed'}, insertId, 20, 
			function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});

		it('update a valid user as a committee member', function(done) {
			faculty_member.updateUser({fm_Lname: 'Bar Changed 2', 
				fm_Fname: 'Foo Changed 2'}, insertId, 10, 
			function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});

		it('update a valid user as a professor', function(done) {
			faculty_member.updateUser({fm_Lname: 'Bar Changed 1', 
				fm_Fname: 'Foo Changed 1'}, insertId, 4, 
			function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});

		it('update a valid user as an admin w/o valid data', function(done) {
			faculty_member.updateUser({}, insertId, 20, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
		});

		it('update a valid user as a committee member w/o valid data', function(done) {
			faculty_member.updateUser({}, insertId, 10, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
		});

		it('update a valid user as a professor w/o valid data', function(done) {
			faculty_member.updateUser({}, insertId, 4, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
		});

		it('update a user as an invalid member', function(done) {
			faculty_member.updateUser({}, insertId, 0, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});
	});

	describe('deleteUser function', function() {
		var insertId;

		before(function setUp(done) {
			faculty_member.createUser({fm_Username: 'foobar', fm_Lname: 'Bar', 
				fm_Fname: 'Foo'}, 20, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				insertId = result['insertId'];
				done();
			});
		});

		it('delete a valid user as an admin', function(done) {
			faculty_member.deleteUser(insertId, 20, 
				function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
		});

		it('delete a user as not an admin', function(done) {
			faculty_member.deleteUser(insertId, 4, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
		});

		it('delete a user as not a valid member', function(done) {
			faculty_member.deleteUser(insertId, 0, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
		});

		it('delete an invalid user as an admin', function(done) {
			faculty_member.deleteUser(0, 20, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
		});
	});

	describe('getUserData function', function() {
		var insertId;

		before(function setUp(done) {
			faculty_member.createUser({fm_Username: 'foobar', fm_Lname: 'Bar', 
				fm_Fname: 'Foo'}, 20, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				insertId = result['insertId'];
				done();
			});
		});

		after(function cleanUp(done) {
			faculty_member.deleteUser(insertId, 20, done);
		});

		it('get member data as an admin', function(done) {
			faculty_member.getUserData(insertId, 20, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});

		it('get member data as a committee member', function(done) {
			faculty_member.getUserData(insertId, 10, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});

		it('get member data as a professor', function(done) {
			faculty_member.getUserData(insertId, 4, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});

		it('get member data as an invalid member', function(done) {
			faculty_member.getUserData(insertId, 0, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});
	});
});
