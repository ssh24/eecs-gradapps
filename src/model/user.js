'use strict';

var assert = require('assert');
var md5 = require('apache-md5');

var Utils = require('../controller/utils');
     
var User = function(connection) {
	this.conn = connection;
	this.utils = new Utils(this.conn);
};

/**
 * Create a new user
 * @param {String} username 
 * @param {String} password 
 * @param {Function} cb 
 */
User.prototype.createUser = function(username, password, cb) {
	assert(typeof username === 'string');
	assert(typeof password === 'string');
	assert(typeof cb === 'function');

	var self = this;
	var insertStmt;
	var encrypted = md5(password);

	this.findUser(username, function(err, isFound) {
		if (err) return cb(err);
		else {
			if (!isFound) {
				insertStmt = self.utils.createInsertStatement('user', ['username', 
					'password'], [JSON.stringify(username), 
					JSON.stringify(encrypted)]);
				self.conn.query(insertStmt, function(err, result) {
					if (err) return cb(err);
					if (result && result.affectedRows === 1) {
						return cb(err, username);
					}
				});
			} else {
				err = new Error('User with username "' + username + '" exists');
				return cb(err);
			}
		}
	});
};

/**
 * Remove an existing user
 * @param {String} username 
 * @param {Function} cb 
 */
User.prototype.removeUser = function(username, cb) {
	assert(typeof username === 'string');
	assert(typeof cb === 'function');

	var self = this;
	var deleteSmt;

	this.findUser(username, function(err, isFound) {
		if (err) return cb(err);
		else {
			if (isFound) {
				deleteSmt = self.utils.createDeleteStatement('user', 
					['username'], [JSON.stringify(username)]);
				self.conn.query(deleteSmt, function(err, result) {
					if (err) return cb(err);
					return cb(err, result.affectedRows === 1);
				});
			} else {
				err = new Error('No user found with username '+ 
				JSON.stringify(username));
				return cb(err);
			}
		}
	});
};


/**
 * Find a user by the username
 * @param {String} username 
 * @param {Function} cb 
 */
User.prototype.findUser = function(username, cb) {
	assert(typeof username === 'string');
	assert(typeof cb === 'function');

	this.conn.query('select * from user where username=' + JSON.stringify(username), 
		function(err, result) {
			if (err) return cb(err);
			return cb(null, result.length === 1);
		});
};

/**
 * Check if a password is correct for the specific user
 * @param {String} username 
 * @param {HashedString} password 
 */
User.prototype.validPassword = function(username, password, cb) {
	assert(typeof username === 'string');
	assert(typeof password === 'string');
	assert(typeof cb === 'function');

	var self = this;

	this.findUser(username, function(err, isFound) {
		if (err) return cb(err);
		else {
			if (isFound) {
				self.conn.query('select * from user where username='+ JSON.stringify(username), 
					function(err, result) {
						if (err) return cb(err);
						if (result && result.length === 1) {
							var isValid = (result[0]['password'] === 
							md5(password, result[0]['password']));
							return cb(err, isValid);
						}
					});
			} else {
				err = new Error('No user found with username "' + username + '"');
				return cb(err);
			}
		}
	});
};

module.exports = User;
