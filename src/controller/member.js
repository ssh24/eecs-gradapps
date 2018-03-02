'use strict';

var assert = require('assert');

var Review = require('./review');
var User = require('../model/user');
var Utils = require('./utils');

var Member = function(connection) {
	this.conn = connection;
	this.user = new User(this.conn);
	this.utils = new Utils(this.conn);
	this.review = new Review(this.conn);
};

/**
 * Remove a member from the system
 * @param {String} adminId 
 * @param {String} memberId 
 * @param {Function} cb 
 */
Member.prototype.removeMember = function(adminId, memberId, cb) {
	assert(typeof adminId === 'number');
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');
    
	var self = this;

	this.utils.getSelectedRole(adminId, function(err, role) {
		if (err) return cb (err);
		if (role === 'Admin') {
			self.utils.getMemberUsername(memberId, function(err, username) {
				if (err) return cb(err);
				if (username) {
					self.conn.query('delete from faculty_member where fm_Id=?', 
						[memberId], function(err, result) {
							if (err) return cb(err);
							if (result && result.affectedRows === 1) {
								self.user.removeUser(username, cb);
							} else {
								err = new Error('No member with id ' + 
								memberId + ' was found to be removed');
								return cb(err);
							}
						});
				} else {
					err = new Error('Member ' + memberId + ' does not exist');
					return cb(err);
				}
			});
		} else {
			err = new Error('Member ' + adminId + ' does not have access to remove a member');
			return cb(err);
		}
	});
};

module.exports = Member;
