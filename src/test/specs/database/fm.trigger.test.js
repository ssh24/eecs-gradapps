'use strict';

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

	describe('updatePreset', function() {

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

});
