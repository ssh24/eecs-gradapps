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
 * Get all the review applications
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

/**
 * Get a single Applicants review(s)
 * @param {Number} appId
 * @param {Number} memberId
 * @param {Function} cb
 */
Application.prototype.getApplicationReview = function(appId, memberId, cb) {
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	var sql = 'SELECT Background, researchExp AS `Research Experience`, ' +
    'Comments, c_Rank as `Committee Ranking`, ' +
		'UniAssessment, Letter ' +
    'from application_review' +
    ' where status=\'Submitted\' and appId=' + this.conn.escape(appId);
	var self = this;

	this.utils.getRoles(memberId, function(err, roles) {
		if (err) return cb(err);
		if (roles.includes('Professor') || roles.includes('Admin')) {
			self.conn.query(sql, function(error, result) {
				if (err) return cb(error);
				if (result.length > 0) {
					cb(err, result);
				} else {
					err = new Error('No reviews found');
					return cb(err);
				}
			});
		} else {
			err = new Error('Member ' + memberId +
        ' does not have access to see application reviews');
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
	sql = sql || 'SELECT app_Id, CONCAT_WS(\' \', `FName`, `LName`) AS `Applicant Name`, ' +
    ' Gender, FOI as `Fields of Interest`, prefProfs as `Preferred Professors`, ' +
    'Rank as `Committee Rank`, GPA, Degree as `Degree Applied For`,' +
    ' VStatus as `Visa Status`, programDecision as `Program Decision`, ' +
    'profContacted as `Contacted By`,' +
    ' profRequested as `Requested By`, ' +
    'seen as `My Interest Status` FROM application LEFT JOIN application_seen ' +
    'ON application.app_Id = application_seen.appId and application_seen.fmId=' + memberId +
    ' where committeeReviewed=1 and Rank is not null';

	assert(typeof sql === 'string');
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	var self = this;

	this.utils.getRoles(memberId, function(err, roles) {
		if (err) return cb(err);
		if (roles.includes('Professor') || roles.includes('Admin')) {
			self.conn.query(sql, function(err, result1) {
				if (err) return cb(err);
				if (result1.length > 0) {
					_.forEach(result1, function(res1) {
						if(res1['My Interest Status'] === null) {
							res1['My Interest Status'] = '-';
						} else if (res1['My Interest Status'] === 1) {
							res1['My Interest Status'] = 'Interested';
						} else if (res1['My Interest Status'] === 0) {
							res1['My Interest Status'] = 'Not Interested';
						}
					});
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

/**
 * Update an application
 * @param {Object} data
 * @param {Number} appId
 * @param {Number} memberId
 * @param {Function} cb
 */
Application.prototype.updateApplication = function(data, appId, memberId, cb) {
	assert(typeof data === 'object');
	assert(typeof appId === 'number');
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	var self = this;
	this.utils.getRoles(memberId, function(err, roles) {
		if (err) return cb(err);
		if (roles.includes('Admin')) {
			self.conn.query('UPDATE application SET ? WHERE app_Id=?', [data,
				appId], function(err, result) {
				if (err) return cb(err);
				return cb(err, result);
			});
		} else {
			err = new Error('Member ' + memberId +
							' does not have access to update application');
			return cb(err);
		}
	});
};

/**
 * Create an application
 * @param {Object} data
 * @param {Number} memberId
 * @param {Function} cb
 */
Application.prototype.createApplication = function(data, memberId, cb) {
	assert(typeof data === 'object');
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	var self = this;
	this.utils.getRoles(memberId, function(err, roles) {
		if (err) return cb(err);
		if (roles.includes('Admin')) {
			self.conn.query('INSERT INTO application SET ?', data, function(err, result) {
				if (err) return cb(err);
				return cb(err, result);
			});
		} else {
			err = new Error('Member ' + memberId +
							' does not have access to upload application');
			return cb(err);
		}
	});
};

/**
 * Delete an application
 * @param {Number} appId
 * @param {Number} memberId
 * @param {Function} cb
 */
Application.prototype.deleteApplication = function(appId, memberId, cb) {
	assert(typeof appId === 'number');
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	var self = this;
	this.utils.getRoles(memberId, function(err, roles) {
		if (err) return cb(err);
		if (roles.includes('Admin')) {
			self.conn.query('DELETE FROM application WHERE app_Id=?', appId,
				function(err, result) {
					if (err) return cb(err);
					return cb(err, result);
				});
		} else {
			err = new Error('Member ' + memberId +
							' does not have access to delete application');
			return cb(err);
		}
	});
};

/**
 * Get application pdf file.
 * @param {Number} appId
 * @param {Number} memberId
 * @param {Function} cb
 */
Application.prototype.getApplicationFile = function(appId, memberId, cb) {
	assert(typeof appId === 'number');
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	var self = this;
	this.utils.getRoles(memberId, function(err, roles) {
		if (err) return cb(err);
		if (roles.includes('Admin') || roles.includes('Committee Member') || 
		roles.includes('Professor')) {
			self.conn.query('SELECT app_file from application where app_Id=?',
				appId, function(err, result) {
					if (err) return cb(err);
					if (result.length === 1) {
						return cb(err, result[0]['app_file']);
					}
				});
		} else {
			err = new Error('Member ' + memberId +
							' does not have access to get application file');
			return cb(err);
		}
	});
};

/**
 * Get all application data.
 * @param {Number} appId
 * @param {Number} memberId
 * @param {Function} cb
 */
Application.prototype.getApplicationData = function(appId, memberId, cb) {
	assert(typeof appId === 'number');
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	var self = this;
	this.utils.getRoles(memberId, function(err, roles) {
		if (err) return cb(err);
		if (roles.includes('Admin')) {
			self.conn.query('SELECT * from application where app_Id=?', [appId],
				function(err, result) {
					if (err) return cb(err);
					if (result.length === 1) {
						return cb(err, result[0]);
					}
				});
		} else {
			err = new Error('Member ' + memberId +
							' does not have access to get application data');
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

	this.utils.getRoles(memberId, function(err, roles) {
		if (err) return cb(err);
		if (roles.includes('Professor')) {
			updateStmt = self.utils.
				createUpdateStatement('application_seen', ['seen'], [status], ['fmId', 'appId'], [memberId, appId]);
			self.conn.query(updateStmt, function(err, result) {
				if (err) return cb(err);
				if (result.affectedRows === 0) {
					insertStmt = self.utils.createInsertStatement('application_seen', ['fmId', 'appId', 'seen'], [memberId, appId, status]);
					self.conn.query(insertStmt, cb);
				} else {
					return cb(err, result);
				}
			});
		} else {
			err = new Error('Member ' + memberId +
        ' does not have access to set interested status');
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

	this.utils.getRoles(memberId, function(err, roles) {
		if (err) return cb(err);
		if (roles.includes('Professor')) {
			self.conn.query('select profContacted from application where app_Id=?', [appId], function(err, result) {
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
						createUpdateStatement('application', ['profContacted'], [JSON.stringify(JSON.stringify(profContacted))], ['app_Id'], [appId]);
					self.conn.query(updateStmt, cb);
				} else {
					err = new Error('No application found for application id ' +
            appId);
					return cb(err);
				}
			});
		} else {
			err = new Error('Member ' + memberId +
        ' does not have access to set contacted status');
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

	this.utils.getRoles(memberId, function(err, roles) {
		if (err) return cb(err);
		if (roles.includes('Professor')) {
			self.conn.query('select profRequested from application where app_Id=?', [appId], function(err, result) {
				if (err) return cb(err);
				if (result.length > 0) {
					profRequested = result[0]['profRequested'] ?
						result[0]['profRequested'] : profRequested;
					if (profRequested && profRequested
						.includes(memberName)) {
						if (status === 0) {
							profRequested.splice(profRequested
								.indexOf(memberName), 1);
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
						createUpdateStatement('application', ['profRequested'], [JSON.stringify(JSON.stringify(profRequested))], ['app_Id'], [appId]);
					self.conn.query(updateStmt, cb);
				} else {
					err = new Error('No application found for application id ' +
            appId);
					return cb(err);
				}
			});
		} else {
			err = new Error('Member ' + memberId +
        ' does not have access to set requested status');
			return cb(err);
		}
	});
};

module.exports = Application;
