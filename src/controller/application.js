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
Application.prototype.getReviewApplications = function(sql, memberId, cb) {
	sql = sql || 'select application.app_Id, DATE_FORMAT(application_review.assignDate, "%m/%d/%Y") as `Date Assigned`, ' + 
	'CONCAT_WS(\' \', application.FName, application.LName) AS `Applicant Name`,  application.Degree as `Degree Applied For`, ' + 
	'application_review.Status as `My Review Status` from application inner join application_review ' + 
	'where application.app_Id = application_review.appId and application_review.committeeId=' + memberId 
	+ ' order by application_review.assignDate;';

	assert(typeof sql === 'string');
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	var self = this;

	this.utils.getRoles(memberId, function(err, roles) {
		if (err) return cb(err);
		if (roles.includes('Committee Member')) {
			self.conn.query(sql, function(err, result1) {
				if (err) return cb(err);
				if(result1.length > 0) {
					return cb(err, result1);
				} else {
					err = new Error('No applications found');
					return cb(err);
				}
			});
		} else {
			err = new Error('Member ' + memberId + 
							' does not have access to see all applications'); 
			return cb(err);
		}
	});
};

module.exports = Application;
