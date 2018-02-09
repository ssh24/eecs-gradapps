'use strict';

var assert = require('assert');

var Review = require('./review');
var Utils = require('./utils');


var Application = function(connection) {
	this.conn = connection;
	this.utils = new Utils(this.conn);
	this.review = new Review(this.conn);
};

/**
 * Mark an application as seen. Can be done by either an admin or a professor.
 * @param {Number} appId 
 * @param {Number} memberId 
 * @param {Function} cb 
 */
Application.prototype.markApplicationSeen = function(appId, memberId, cb) {
	assert(typeof appId === 'number');
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	var self = this;
	var updateStmt;

	this.utils.getSelectedRole(memberId, function(err, role) {
		if (err) return cb (err);
		if (role === 'Professor' || role === 'Admin') {
			self.review.isSubmitted(appId, function(err, result) {
				if (err) return cb(err);
				if (result) {
					updateStmt = self.utils.
						createUpdateStatement('application_seen', 
							['seen'], [1], ['fmId', 'appId'], [memberId, 
								appId]);
					self.conn.query(updateStmt, cb);
				} else {
					err = new Error('Application ' + appId + 
							' has not been reviewed yet');
					return cb(err);
				}
			});  
		} else {
			err = new Error('Member ' + memberId + 
					' does not have access to see application ' + appId); 
			return cb(err);
		}
	});
};

module.exports = Application;
