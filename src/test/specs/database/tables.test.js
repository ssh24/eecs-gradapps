'use strict';

var _ = require('lodash');

var assert = require('assert');
var config = require('../../lib/utils/config');
var mysql = require('mysql2');

var connection;
var creds = config.credentials.database;

/*
** Test class for assessing all the tables
*/
describe('Tables Test', function() {
	before(function(done) {
		connection = mysql.createConnection(creds);
		connection.connect(done);
	});
    
	after(function(done) {
		connection.end(done);
	});

	// Check for all table names
	it('get all table names', function(done) {
		var all_tables = config.database.tables;
            
		connection.query('SHOW TABLES', function(err, tables) {
			if(err) done(err);
			assert(tables);
			assert.equal(all_tables.length, tables.length);
			_.forEach(tables, function(table) {
				var name = table['Tables_in_' + creds.database];
				assert.ok(all_tables.includes(name), 'Table exists!');
			});
			done();
		});
	});

	// test table descriptions
	describe('table descriptions', function() {
		it('faculty_member', function(done) {
			var fields = config.database.fields.faculty_member;
			connection.query('DESCRIBE faculty_member', 
				function(err, descriptions) {
					if (err) done(err);
					assert(descriptions, 'Description should exist');
					assert.equal(fields.length, descriptions.length, 
						'Field lengths should match');
					_.forEach(descriptions, function(description) {
						assert(fields.includes(description['Field']));
					});
					var primaryKey = _.filter(descriptions, 
						function(description) {
							return description['Key'] === 'PRI';
						});
					assert.equal(1, primaryKey.length, 
						'There should be only one PK');
					assert.equal(fields[0], primaryKey[0]['Field'], 
						'Primary key should match');
					done();
				});
		});

		it('application', function(done) {
			var fields = config.database.fields.application;
			connection.query('DESCRIBE application', 
				function(err, descriptions) {
					if (err) done(err);
					assert(descriptions, 'Description should exist');
					assert.equal(fields.length, descriptions.length, 
						'Field lengths should match');
					_.forEach(descriptions, function(description) {
						assert(fields.includes(description['Field']));
					});
					var primaryKey = _.filter(descriptions, 
						function(description) {
							return description['Key'] === 'PRI';
						});
					assert.equal(1, primaryKey.length, 
						'There should be only one PK');
					assert.equal(fields[0], primaryKey[0]['Field'], 
						'Primary key should match');
					done();
				});
		});

		it('application_review', function(done) {
			var fields = config.database.fields.application_review;
			connection.query('DESCRIBE application_review', 
				function(err, descriptions) {
					if (err) done(err);
					assert(descriptions, 'Description should exist');
					assert.equal(fields.length, descriptions.length, 
						'Field lengths should match');
					_.forEach(descriptions, function(description) {
						assert(fields.includes(description['Field']));
					});
					var primaryKey = _.filter(descriptions, 
						function(description) {
							return description['Key'] === 'PRI';
						});
					assert.equal(2, primaryKey.length, 
						'There should be two PKs');
					assert.equal(fields[0], primaryKey[0]['Field'], 
						'First primary key should match');
					assert.equal(fields[1], primaryKey[1]['Field'], 
						'Second primary key should match');
					done();
				});
		});

		it('application_seen', function(done) {
			var fields = config.database.fields.application_seen;
			connection.query('DESCRIBE application_seen', 
				function(err, descriptions) {
					if (err) done(err);
					assert(descriptions, 'Description should exist');
					assert.equal(fields.length, descriptions.length, 
						'Field lengths should match');
					_.forEach(descriptions, function(description) {
						assert(fields.includes(description['Field']));
					});
					var primaryKey = _.filter(descriptions, 
						function(description) {
							return description['Key'] === 'PRI';
						});
					assert.equal(2, primaryKey.length, 
						'There should be two PKs');
					assert.equal(fields[0], primaryKey[0]['Field'], 
						'First primary key should match');
					assert.equal(fields[1], primaryKey[1]['Field'], 
						'Second primary key should match');
					done();
				});
		});

		it('university', function(done) {
			var fields = config.database.fields.university;
			connection.query('DESCRIBE university', 
				function(err, descriptions) {
					if (err) done(err);
					assert(descriptions, 'Description should exist');
					assert.equal(fields.length, descriptions.length, 
						'Field lengths should match');
					_.forEach(descriptions, function(description) {
						assert(fields.includes(description['Field']));
					});
					var primaryKey = _.filter(descriptions, 
						function(description) {
							return description['Key'] === 'PRI';
						});
					assert.equal(1, primaryKey.length, 
						'There should be only one PK');
					assert.equal(fields[0], primaryKey[0]['Field'], 
						'Primary key should match');
					done();
				});
		});

		it('field of interest', function(done) {
			var fields = config.database.fields.foi;
			connection.query('DESCRIBE foi', 
				function(err, descriptions) {
					if (err) done(err);
					assert(descriptions, 'Description should exist');
					assert.equal(fields.length, descriptions.length, 
						'Field lengths should match');
					_.forEach(descriptions, function(description) {
						assert(fields.includes(description['Field']));
					});
					var primaryKey = _.filter(descriptions, 
						function(description) {
							return description['Key'] === 'PRI';
						});
					assert.equal(1, primaryKey.length, 
						'There should be only one PK');
					assert.equal(fields[0], primaryKey[0]['Field'], 
						'Primary key should match');
					done();
				});
		});
	});

	// test table relations
	describe('table relations', function() {
		it('foreign key constraints on application table', function(done) {
			var ref_table_name = 'application';
			var ref_col_name = 'app_Id';
			var tables = ['application_review', 'application_seen'];
			connection.query('SELECT TABLE_NAME,COLUMN_NAME,CONSTRAINT_NAME, ' 
			+ 'REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME FROM ' + 
			'INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE ' + 
			'REFERENCED_TABLE_SCHEMA = \'' + creds.database + 
			'\' AND REFERENCED_TABLE_NAME = \'' + ref_table_name + '\';', 
			function(err, relations) {
				if(err) done(err);
				assert(relations);
				assert.equal(2, relations.length);
				assert(tables.includes(relations[0]['TABLE_NAME']), 
					'First table exists');
				assert(tables.includes(relations[1]['TABLE_NAME']), 
					'First table exists');
				assert.equal(ref_table_name, 
					relations[0]['REFERENCED_TABLE_NAME'], 
					'Table name should match');
				assert.equal(ref_table_name, 
					relations[1]['REFERENCED_TABLE_NAME'], 
					'Table name should match');
				assert.equal(ref_col_name, 
					relations[0]['REFERENCED_COLUMN_NAME'], 
					'Column name should match');
				assert.equal(ref_col_name, 
					relations[1]['REFERENCED_COLUMN_NAME'], 
					'Column name should match');
				done();
			});
		});

		it('foreign key constraints on faculty_member table', function(done) {
			var ref_table_name = 'faculty_member';
			var ref_col_name = 'fm_Id';
			var tables = ['application_review', 'application_seen'];
			connection.query('SELECT TABLE_NAME,COLUMN_NAME,CONSTRAINT_NAME, ' 
			+ 'REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME FROM ' + 
			'INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE ' + 
			'REFERENCED_TABLE_SCHEMA = \'' + creds.database + 
			'\' AND REFERENCED_TABLE_NAME = \'' + ref_table_name + '\';', 
			function(err, relations) {
				if(err) done(err);
				assert(relations);
				assert.equal(2, relations.length);
				assert(tables.includes(relations[0]['TABLE_NAME']), 
					'First table exists');
				assert(tables.includes(relations[1]['TABLE_NAME']), 
					'Second table exists');
				assert.equal(ref_table_name, 
					relations[0]['REFERENCED_TABLE_NAME'], 
					'Table name should match');
				assert.equal(ref_table_name, 
					relations[1]['REFERENCED_TABLE_NAME'], 
					'Table name should match');
				assert.equal(ref_col_name, 
					relations[0]['REFERENCED_COLUMN_NAME'], 
					'Column name should match');
				assert.equal(ref_col_name, 
					relations[1]['REFERENCED_COLUMN_NAME'], 
					'Column name should match');
				done();
			});
		});
	});
});
