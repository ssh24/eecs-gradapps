'use strict';

var assert = require('assert');

var Utils = require('./utils');

var Authentication = function(connection) {
	this.conn = connection;
	this.utils = new Utils(this.conn);
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
