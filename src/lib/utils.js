'use strict';

var assert = require('assert');

var Utils = function (connection) {
	this.conn = connection;
};

/**
 * Create an insert statement given the table name, field names and their corresponding values.
 * @param {String} tableName 
 * @param {Array} fieldNames 
 * @param {Array} values 
 */
Utils.prototype.createInsertStatement = function(tableName, fieldNames, values){
	assert(typeof tableName === 'string');
	assert(Array.isArray(fieldNames));
	assert(Array.isArray(values));
	assert(fieldNames.length === values.length);
    
	var statement = 'INSERT INTO ' + tableName + ' (';
	var commaDelimeter = ',';
    
	var fnStatement = '';
	for(var i = 0; i < fieldNames.length; i++) {
		if (i < fieldNames.length - 1) {
			fnStatement = fnStatement + fieldNames[i] + commaDelimeter;
		} else {
			fnStatement = fnStatement + fieldNames[i] + ') VALUES (';
		}
	}
    
	var valueStatement = '';
	for(var j = 0; j < values.length; j++) {
		if (j < values.length - 1) {
			valueStatement = valueStatement + values[j] + commaDelimeter;
		} else {
			valueStatement = valueStatement + values[j] + ')';
		}
	}
    
	statement = statement + fnStatement + valueStatement;
	return statement;
};

/**
 * Create an update statement given the table name, field names and their corresponding values.
 * @param {String} tableName 
 * @param {Array} fieldNames 
 * @param {Array} values 
 * @param {Array} whereFields 
 * @param {Array} whereValues 
 */
Utils.prototype.createUpdateStatement = function(tableName, fieldNames, values, 
	whereFields, whereValues){
	assert(typeof tableName === 'string');
	assert(Array.isArray(fieldNames));
	assert(Array.isArray(values));
	assert(fieldNames.length === values.length);
	assert(Array.isArray(whereFields));
	assert(Array.isArray(whereValues));
	assert(whereFields.length === whereValues.length);
    
	var statement = 'UPDATE ' + tableName + ' SET ';
	var commaDelimeter = ',';
	var andDelimeter = ' AND ';
    
	var fnStatement = '';
	for(var i = 0; i < fieldNames.length; i++) {
		if (i < fieldNames.length - 1) {
			fnStatement = fnStatement + fieldNames[i] + '=' + values[i] + 
			commaDelimeter;
		} else {
			fnStatement = fnStatement + fieldNames[i] + '=' + values[i] + 
			' WHERE ';
		}
	}

	var whereStatement = '';
	for(var j = 0; j < whereFields.length; j++) {
		if (j < whereFields.length - 1) {
			whereStatement = whereStatement + whereFields[j] + '=' + 
			whereValues[j] + andDelimeter;
		} else {
			whereStatement = whereStatement + whereFields[j] + '=' + 
			whereValues[j];
		}
	}

	statement = statement + fnStatement + whereStatement;
	return statement;
};

/**
 * Create a delete statement given the table name, field names and their corresponding values.
 * @param {String} tableName 
 * @param {Array} fieldNames 
 * @param {Array} values
 */
Utils.prototype.createDeleteStatement = function(tableName, fieldNames, values){
	assert(typeof tableName === 'string');
	assert(Array.isArray(fieldNames));
	assert(Array.isArray(values));
	assert(fieldNames.length === values.length);
    
	var statement = 'DELETE FROM ' + tableName + ' WHERE ';
	var andDelimeter = ' AND ';
    
	var fnStatement = '';
	for(var i = 0; i < fieldNames.length; i++) {
		if (i < fieldNames.length - 1) {
			fnStatement = fnStatement + fieldNames[i] + '=' + values[i] + 
			andDelimeter;
		} else {
			fnStatement = fnStatement + fieldNames[i] + '=' + values[i];
		}
	}
	statement = statement + fnStatement;
	return statement;
};

/**
 * Returns true if memberId is assigned to the given role.
 * @param {Number} memberId 
 * @param {String} role 
 * @param {Function} cb 
 */
Utils.prototype.hasRole = function(memberId, role, cb) {
	assert(typeof memberId === 'number');
	assert(typeof role === 'string');
	assert(typeof cb === 'function');

	this.conn.query('Select fm_Roles from faculty_member where fm_Id = ?', 
		[memberId], function(err, results) {
			if (err) return cb(err);
			if (results.length === 0) {
				err = new Error('Member with id ' + memberId + 
                ' does not exists');
				return cb(err);
			}
			assert(1, results.length);
			var roles = results[0]['fm_Roles'];
			return cb(err, roles.includes(role));
		});
};

/**
 * Returns all the roles of a member.
 * @param {Number} memberId 
 * @param {Function} cb
 */
Utils.prototype.getRoles = function(memberId, cb) {
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	this.conn.query('Select fm_Roles from faculty_member where fm_Id = ?', 
		[memberId], function(err, results) {
			if (err) return cb(err);
			if (results.length === 0) {
				err = new Error('Member with id ' + memberId + 
                ' does not exists');
				return cb(err);
			}
			assert(1, results.length);
			var roles = results[0]['fm_Roles'];
			return cb(err, roles);
		});
};

module.exports = Utils;
