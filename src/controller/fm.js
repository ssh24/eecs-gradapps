'use strict';

var assert = require('assert');
var Utils = require('./utils');
var tableName = 'faculty_member';
var FM = function(connection) {
	this.conn = connection;
	this.utils = new Utils(this.conn);
};

/**
 * Get a faculty_member presets.
 * @param {Number} memberId
 * @param {String} role
 */
FM.prototype.getPresets = function(memberId, role, cb) {
	assert(typeof memberId === 'number', 'memberId should be a number');
	assert(typeof role === 'string', 'role should  be a string');
	assert(typeof cb === 'function', 'cb should be a function');
	var self=this;
	//check if the user has the roles
	this.utils.hasRole(memberId, role, function(err, result) {
		var presetRole;
		if (err) {
			return cb(err);
		}
		//checks which role was selected and if the member has the role.
		if (role === 'Professor' && result) {
			presetRole = 'presetProf';
		} else if (role === 'Admin' && result) {
			presetRole = 'presetAdmin';
		} else if (role === 'Committee Member' && result) {
			presetRole = 'presetCommittee';
		} else {
			err = new Error('Member ' + memberId + 'could not save the preset for role ' + role + '. This may be because you are not assigned the role or the role does not exist.');
			return cb(err, result);
		}
		var sql = 'SELECT ' + presetRole + ' from ' + tableName + ' where FM_Id = ' + memberId;
		self.conn.query(sql, cb);
	});
};

/**
 * Update faculty_member presets.
 * If a preset exists with the same name it will update it to match the new values
 * // NOTE: escape input to prevent sql injections
 * @param {Number} memberId
 * @param {String} role
 * @param {Number} preset_name
 * @param {JSON} options
 * @param {Array} options.column_names
 * @param {Array} options.column_val
 * @param {Array} options.filter_name
 * @param {Array} options.filter_val
 */
FM.prototype.updatePreset = function(memberId, role, preset_name, options, cb) {
	assert(typeof memberId === 'number', 'memberId should be a number');
	assert(typeof role === 'string', 'role should  be a string');
	assert(typeof preset_name === 'string', 'preset_name should be a string');
	assert(typeof options === 'object', 'options should be an object');
	assert(options.column_name, 'options.column_name should exist');
	assert(options.column_val, 'options.column_val should exist');
	assert(options.filter_name, 'options.column_name should exist');
	assert(options.filter_val, 'options.filter_val should exist');
	assert(Array.isArray(options.column_name), 'options.column_name should be an array');
	assert(Array.isArray(options.column_val), 'options.column_val should be an array');
	assert(options.column_name.length === options.column_val.length, 'options.column_name and options.column_val should be the same length');
	assert(Array.isArray(options.filter_name), 'options.filter_name should be an array');
	assert(Array.isArray(options.filter_val), 'options.filter_val should be an array');
	assert(options.filter_name.length === options.filter_val.length, 'options.filter_name and options.filter_val should be the same length');
	assert(typeof cb === 'function', 'cb should be a function');

	var commaDelimeter = ',';
	var presetRole;
	var self = this;
	//check if the user has the roles
	this.utils.hasRole(memberId, role, function(err, result) {
		if (err) return cb(err);
		//checks which role was selected and if the member has the role.
		if (role === 'Professor' && result) {
			presetRole = 'presetProf';
		} else if (role === 'Admin' && result) {
			presetRole = 'presetAdmin';
		} else if (role === 'Committee Member' && result) {
			presetRole = 'presetCommittee';
		} else {
			err = new Error('Member ' + memberId + ' could not save the preset for role ' + role + '. This may be because you are not assigned the role or the role does not exist.');
			return cb(err, result);
		}

		var whereField = 'FM_Id';
		//to be used for inserting in JSON_OBJECT for sql
		var col = 'JSON_OBJECT(';
		for (var i = 0; i < options.column_name.length; i++) {
			if (i < options.column_name.length - 1) {
				col = col + '\'' + options.column_name[i] + '\'' + commaDelimeter + '\'' + options.column_val[i] + '\'' + commaDelimeter;
			} else {
				col = col + '\'' + options.column_name[i] + '\'' + commaDelimeter + '\'' + options.column_val[i] + '\'' + ')';
			}
		}
		var filt = 'JSON_OBJECT(';
		for (i = 0; i < options.filter_name.length; i++) {
			if (i < options.filter_name.length - 1) {
				filt = filt + '\'' + options.filter_name[i] + '\'' + commaDelimeter + '\'' + options.filter_val[i] + '\'' + commaDelimeter;
			} else {
				filt = filt + '\'' + options.filter_name[i] + '\'' + commaDelimeter + '\'' + options.filter_val[i] + '\'' + ')';
			}
		}

		var preset_json = 'JSON_OBJECT(\'cols\'' + commaDelimeter + col + commaDelimeter + '\'filt\'' + commaDelimeter + filt + ')';
		var presetRoleVal = 'IF(' + presetRole + ' is NULL, JSON_OBJECT(\'' + preset_name + '\'' + commaDelimeter + preset_json + ')' + commaDelimeter + 'JSON_SET(' + presetRole + commaDelimeter + '\'$."' + preset_name + '"\'' + commaDelimeter + preset_json + '))';
		var updateStatement = self.utils.createUpdateStatement(tableName, [presetRole], [presetRoleVal], [whereField], [memberId]);
		self.conn.query(updateStatement, cb);
	});

};

module.exports = FM;
