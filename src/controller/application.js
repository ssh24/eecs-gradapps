'use strict';

var _ = require('lodash');
var assert = require('assert');

var Review = require('./review');
var Utils = require('./utils');


var Application = function (connection) {
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

	this.utils.getRoles(memberId, function(err, roles) {
		if (err) return cb (err);
		if (roles.includes('Professor') || roles.includes('Admin')) {
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

/**
 * Get all the applications
 * @param {String} sql
 * @param {Number} memberId
 * @param {Function} cb
 */
Application.prototype.getApplications = function (sql, memberId, cb) {
	assert(typeof sql === 'string');
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	var self = this;

	this.conn.query(sql, function(err, result1) {
		if (err) return cb(err);
		if(result1.length > 0) {
			self.conn.query('Select appId, seen from application_seen where ' +
			'fmId=? and seen=?',
			[memberId, 1], function(err, result2) {
				if (err) return cb(err);
				if (result2.length > 0) {
					var appIds = _.map(result2, 'appId');
					_.forEach(result1, function(res1) {
						if(appIds.includes(res1['app_Id'])) {
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

module.exports = Application;
