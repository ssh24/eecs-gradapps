'use strict';

var assert = require('assert');

var User = require('../model/user');
var Utils = require('./utils');

var Authentication = function(connection) {
	this.conn = connection;
	this.user = new User(this.conn);
	this.utils = new Utils(this.conn);
};

/**
 * Sign up a user
 * @param {Object} options 
 * @param {Function} cb 
 */
Authentication.prototype.signUp = function(options, cb) {
	assert(typeof options === 'object');
	assert(typeof cb === 'function');

	options.email = options.email || null;

	var self = this;

	this.conn.query('insert into faculty_member (`fm_Lname`, `fm_Fname`, ' + 
	'`fm_Email`, `fm_Username`) VALUES (?, ?, ?, ?)', [options.lname, 
		options.fname, options.email, options.username], function(err, result) {
		if (err) return cb(err);
		if (result && result.affectedRows === 1) {
			self.user.createUser(options.username, options.password, cb);
		} else {
			err = new Error('Failed to create user with id "' + options.username 
			+ '"');
			return cb(err);
		}
	});
};

/**
 * Login as a member
 * @param {Number} memberId
 * @param {Function} cb
 */
Authentication.prototype.logIn = function(memberId, cb) {
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');
    
	var self = this;
	var updateStmt;
    
	this.utils.isLoggedIn(memberId, function(err, result) {
		if (err) return cb(err);
		if (!result) {
			updateStmt = self.utils.createUpdateStatement('faculty_member', 
				['is_LoggedIn'], [1], ['fm_Id'], [memberId]);
			self.conn.query(updateStmt, cb);
		} else {
			err = new Error('Member ' + memberId + ' is already logged in');
			return cb(err);
		}
	});
};

/**
 * Logout as a member
 * @param {Number} memberId 
 * @param {Function} cb
 */
Authentication.prototype.logOut = function(memberId, cb) {
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');
    
	var self = this;
	var updateStmt;
    
	this.utils.isLoggedIn(memberId, function(err, result) {
		if (err) return cb(err);
		if (result) {
			updateStmt = self.utils.createUpdateStatement('faculty_member', 
				['is_LoggedIn', 'selectedRole'], [0, null], ['fm_Id'], [memberId]);
			self.conn.query(updateStmt, cb);
		} else {
			err = new Error('Member ' + memberId + ' is not logged in');
			return cb(err);
		}
	});
};

/**
 * Select a role after logging in
 * @param {Number} memberId 
 * @param {String} role 
 * @param {Function} cb 
 */
Authentication.prototype.selectRole = function(memberId, role, cb) {
	assert(typeof memberId === 'number');
	assert(typeof role === 'string');
	assert(typeof cb === 'function');
    
	var self = this;
	var updateStmt;
    
	this.utils.isLoggedIn(memberId, function(err, result) {
		if (err) return cb(err);
		if (result) {
			self.utils.hasRole(memberId, role, function(err, result) {
				if (err) return cb(err);
				if (result) {
					updateStmt = self.utils.createUpdateStatement('faculty_member', 
						['selectedRole'], ['"' + role + '"'], ['fm_Id'], 
						[memberId]);
					self.conn.query(updateStmt, cb);
				} else {
					err = new Error('Member ' + memberId + ' does not have ' + 
					'access as ' + role);
					return cb(err);
				}
			});
		} else {
			err = new Error('Member ' + memberId + ' is not logged in');
			return cb(err);
		}
	});
};

module.exports = Authentication;
