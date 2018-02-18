'use strict';

var _ = require('lodash');
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
		if (err) return cb(err);
		if (role === 'Professor' || role === 'Admin') {
			self.review.isSubmitted(appId, function(err, result) {
				if (err) return cb(err);
				if (result) {
					updateStmt = self.utils.
						createUpdateStatement('application_seen', ['seen'], [1], ['fmId', 'appId'], [memberId,
							appId
						]);
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

/**
 * Get all the applications
 * @param {String} sql
 * @param {Number} memberId
 * @param {Function} cb
 */
Application.prototype.getApplications = function(sql, memberId, cb) {
	assert(typeof sql === 'string');
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	var self = this;

	this.conn.query(sql, function(err, result1) {
		if (err) return cb(err);
		if (result1.length > 0) {
			self.conn.query('Select appId, seen from application_seen where ' +
        'fmId=? and seen=?', [memberId, 1],
			function(err, result2) {
				if (err) return cb(err);
				if (result2.length > 0) {
					var appIds = _.map(result2, 'appId');
					_.forEach(result1, function(res1) {
						if (appIds.includes(res1['app_Id'])) {
							res1['My Interest Status'] = 'Interested';
						} else {
							res1['My Interest Status'] = '-';
						}
						delete res1['app_Id'];
					});
					return cb(err, result1);
				} else {
					err = new Error('No applications found');
					return cb(err);
				}
			});
		} else {
			err = new Error('No applications found');
			return cb(err);
		}
	});
};

/**
 * Update application interest status
 * @param {Number} appId 
 * @param {Number} memberId 
 * @param {Number} status 
 * @param {Function} cb 
 */
Application.prototype.updateInterestedStatus = function(appId, memberId, status, 
	cb) {
	appId = parseInt(appId, 10);
	assert(typeof appId === 'number');
	assert(typeof memberId === 'number');
	assert(typeof status === 'number');
	assert(typeof cb === 'function');

	var updateStmt, insertStmt;
	var self = this;

	this.utils.isLoggedIn(memberId, function(err, result) {
		if (err) return cb(err);
		if (result) {
			updateStmt = self.utils.
				createUpdateStatement('application_seen', 
					['seen'], [status], ['fmId', 'appId'], [memberId, appId]);
			self.conn.query(updateStmt, function(err, result) {
				if (err) return cb(err);
				console.log('Came here after update %d, %d', appId, memberId);
				if (result.affectedRows === 0) {
					console.log('Came here for insert.');
					insertStmt = self.utils.createInsertStatement('application_seen',
						['fmId', 'appId', 'seen'], [memberId, appId, status]);
					self.conn.query(insertStmt, cb);
				} else {
					return cb(err, result);
				}
			});
		} else {
			err = new Error('Member ' + memberId + ' is not logged in');
			return cb(err);
		}
	});
};

/**
 * Update application contacted status
 * @param {Number} appId
 * @param {Number} memberId 
 * @param {String} memberName 
 * @param {Number} status 
 * @param {Function} cb 
 */
Application.prototype.updateContactedStatus = function(appId, memberId, memberName, 
	status, cb) {
	appId = parseInt(appId, 10);
	assert(typeof appId === 'number');
	assert(typeof memberId === 'number');
	assert(typeof memberName === 'string');
	assert(typeof cb === 'function');

	var updateStmt;
	var self = this;
	var profContacted = [];

	this.utils.isLoggedIn(memberId, function(err, result) {
		if (err) return cb(err);
		if (result) {
			self.conn.query('select profContacted from application where app_Id=?', 
				[appId], function(err, result){
					if (err) return cb(err);
					if (result.length > 0) {
						profContacted = result[0]['profContacted'] ? 
							result[0]['profContacted'] : profContacted;
						if (profContacted && profContacted.includes(memberName)) {
							if (status === 0) {
								profContacted.splice(profContacted.indexOf(memberName), 1);
							} else {
								err = new Error('Cannot set contacted to an ' + 
								'already contacted applicant');
								return cb(err);
							}
						} else {
							if (status === 1) {
								profContacted.push(memberName);
							} else {
								err = new Error('Cannot set uncontacted to a ' + 
								'not contacted applicant');
								return cb(err);
							}
						}
						updateStmt = self.utils.
							createUpdateStatement('application', 
								['profContacted'], [JSON.stringify(JSON.
									stringify(profContacted))], 
								['app_Id'], [appId]);
						self.conn.query(updateStmt, cb);
					} else {
						err = new Error('No application found for application id ' 
						+ appId);
						return cb(err);
					}
				});
		} else {
			err = new Error('Member ' + memberId + ' is not logged in');
			return cb(err);
		}
	});
};

/**
 * Update application requested status
 * @param {Number} appId 
 * @param {Number} memberId 
 * @param {String} memberName 
 * @param {Number} status 
 * @param {Function} cb 
 */
Application.prototype.updateRequestedStatus = function(appId, memberId, memberName, 
	status, cb) {
	appId = parseInt(appId, 10);
	assert(typeof appId === 'number');
	assert(typeof memberId === 'number');
	assert(typeof memberName === 'string');
	assert(typeof cb === 'function');

	var updateStmt;
	var self = this;
	var profRequested = [];

	this.utils.isLoggedIn(memberId, function(err, result) {
		if (err) return cb(err);
		if (result) {
			self.conn.query('select profRequested from application where app_Id=?', 
				[appId], function(err, result){
					if (err) return cb(err);
					if (result.length > 0) {
						profRequested = result[0]['profRequested'] ? 
							result[0]['profRequested'] : profRequested;
						if (profRequested && profRequested.includes(memberName)) {
							if (status === 0) {
								profRequested.splice(profRequested.indexOf(memberName), 1);
							} else {
								err = new Error('Cannot set requested to an ' + 
								'already requested applicant');
								return cb(err);
							}
						} else {
							if (status === 1) {
								profRequested.push(memberName);
							} else {
								err = new Error('Cannot set unrequested to a ' + 
								'not requested applicant');
								return cb(err);
							}
						}
						updateStmt = self.utils.
							createUpdateStatement('application', 
								['profRequested'], [JSON.stringify(JSON.
									stringify(profRequested))], 
								['app_Id'], [appId]);
						self.conn.query(updateStmt, cb);
					} else {
						err = new Error('No application found for application id ' 
						+ appId);
						return cb(err);
					}
				});
		} else {
			err = new Error('Member ' + memberId + ' is not logged in');
			return cb(err);
		}
	});
};

module.exports = Application;
