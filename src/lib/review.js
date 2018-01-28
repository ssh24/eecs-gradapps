'use strict';

var _ = require('lodash');
var assert = require('assert');

var Utils = require('./utils');

var Review = function(connection) {
	this.conn = connection;
	this.utils = new Utils(this.conn);
};

/**
 * Assign an application for review to a committee member.
 * @param {Number} appId 
 * @param {Number} memberId
 * @param {Function} cb
 */
Review.prototype.assignReview = function(appId, memberId, cb) {
	assert(typeof appId == 'number');
	assert(typeof memberId == 'number');
	assert(typeof cb === 'function');
    
	var self = this;
	var insertStmt;
    
	this.utils.hasRole(memberId, 'Committee Member', function(err, result) {
		if (err) return cb(err);
		if (result) {
			insertStmt = self.utils.createInsertStatement('application_review', 
				['committeeId', 'appId', 'Status'], [memberId, appId, '"New"']);
			self.conn.query(insertStmt, cb);
		} else {
			err = new Error('Member ' + memberId + ' is not a committee member');
			return cb(err);
		}
	});
};

/**
 * Unassign a review application from a committee member.
 * @param {Number} appId 
 * @param {Number} memberId
 * @param {Function} cb
 */
Review.prototype.unassignReview = function(appId, memberId, cb) {
	assert(typeof appId == 'number');
	assert(typeof memberId == 'number');
	assert(typeof cb === 'function');
    
	var self = this;
	var deleteStmt;

	this.getReviewStatus(appId, memberId, function(err, status) {
		if (err) return cb(err);
		if(status === 'New' || status === 'Draft') {
			deleteStmt = self.utils.createDeleteStatement('application_review', 
				['committeeId', 'appId'], [memberId, appId]);
			self.conn.query(deleteStmt, cb);
		} else if(status === 'In-Progress') {
			err = new Error('Application ' + appId + ' is under review by ' + 
            'member ' + memberId);
			return cb(err);
		}
		else if (status === 'Reviewed') {
			err = new Error('Application ' + appId + ' has been reviewed by ' + 
            'member ' + memberId);
			return cb(err);
		} else {
			err = new Error('Application ' + appId + ' has been submitted by ' + 
            'member ' + memberId);
			return cb(err);
		}
	});
};

/**
 * Remind a review to a committee member.
 * @param {Number} adminId 
 * @param {Number} committeeId 
 * @param {Number} appId 
 * @param {Function} cb 
 */
Review.prototype.remindReview = function(adminId, committeeId, appId, cb) {
	assert(typeof adminId == 'number');
	assert(typeof committeeId == 'number');
	assert(typeof appId == 'number');
	assert(typeof cb === 'function');
    
	var self = this;
	var updateStatement;
    
	this.utils.hasRole(adminId, 'Admin', function(err, result) {
		if (err) return cb(err);
		if (result) {
			self.utils.hasRole(committeeId, 'Committee Member', 
				function(err, result) {
					if (err) return cb(err);
					if (result) {
						self.getReviewStatus(appId, committeeId, 
							function(err, status) {
								if (err) return cb(err);
								if (status != 'Submitted') {
									updateStatement = self.utils.
										createUpdateStatement(
											'application_review', 
											['lastReminded'], 
											['CURRENT_TIMESTAMP'], ['appId', 
												'committeeId'], [appId, 
												committeeId]);
									self.conn.query(updateStatement, cb);
								} else {
									err = new Error('Application ' + appId + 
                                    ' is already reviewed by member ' + 
                                    committeeId);
									return cb(err);  
								}
							});
					} else {
						err = new Error('Member ' + committeeId + ' is not a ' 
                        + 'committtee member');
						return cb(err);
					}
				});
		} else {
			err = new Error('Member ' + adminId + ' is not an admin');
			return cb(err);
		}
	});
};

/**
 * Begin a new review.
 * @param {Number} appId 
 * @param {Number} memberId
 * @param {Function} cb
 */
Review.prototype.beginReview = function(appId, memberId, cb) {
	assert(typeof appId == 'number');
	assert(typeof memberId == 'number');
	assert(typeof cb === 'function');
    
	this.openReview(appId, memberId, cb);
};

/**
 * Resume a review.
 * @param {Number} appId 
 * @param {Number} memberId
 * @param {Function} cb 
 */
Review.prototype.resumeReview = function(appId, memberId, cb) {
	assert(typeof appId == 'number');
	assert(typeof memberId == 'number');
	assert(typeof cb === 'function');
    
	this.openReview(appId, memberId, cb);
};

/**
 * Open a review.
 * @param {Number} appId 
 * @param {Number} memberId
 * @param {Function} cb
 */
Review.prototype.openReview = function(appId, memberId, cb) {
	assert(typeof appId == 'number');
	assert(typeof memberId == 'number');
	assert(typeof cb === 'function');
    
	var self = this;
	var updateStatement;
	
	this.getReviewStatus(appId, memberId, function(err, status) {
		if (err) return cb(err);
		if (status === 'New' || status === 'Draft') {
			self.conn.query('Select * from application_review where ' + 
			'committeeId = ? and Status = "In-Progress"', [memberId], 
			function(err, results) {
				if (err) return cb(err);
				if (results.length >= 1) {
					err = new Error('Member ' + memberId + ' has more than one ' 
					+ 'on-going review application open ');
					return cb(err);
				}
				updateStatement = self.utils.createUpdateStatement(
					'application_review', ['Status'], ['"In-Progress"'], 
					['committeeId', 'appId'], [memberId, appId]);
				self.conn.query(updateStatement, cb);
			});
		} else {
			err = new Error('Application ' + appId + ' is in ' + status + 
            ' stage by member ' + memberId);
			return cb(err);
		}
	});

};

/**
 * Write a review for an application.
 * @param {Number} appId 
 * @param {Number} memberId 
 * @param {*} options 
 * @param {Function} cb 
 */
Review.prototype.writeReview = function(appId, memberId, options, cb) {
	assert(typeof appId == 'number');
	assert(typeof memberId == 'number');
	assert(typeof options === 'object');
	assert(Array.isArray(options['fieldNames']));
	assert(Array.isArray(options['values']));
	assert(typeof cb === 'function');
    
	var self = this;
	var updateStatement;
	var fieldNames = options['fieldNames'];
	var values = options['values'];
    
	this.conn.query('Select * from application_review where appId = ? and ' + 
    'committeeId = ? and Status = "In-Progress"', [appId, memberId], 
	function(err, results) {
		if(err) return cb(err);
		if (results.length === 0) {
			err = new Error('Application ' + appId + 
            ' is not in-progress by member ' + memberId);
			return cb(err);
		}
		assert(1, results.length);
		updateStatement = self.utils.createUpdateStatement('application_review', 
			fieldNames, values, ['appId', 'committeeId'], [appId, memberId]);
		self.conn.query(updateStatement, cb);
	});
};

/**
 * Save an on-going review.
 * @param {Number} appId 
 * @param {Number} memberId
 * @param {Function} cb
 */
Review.prototype.saveReview = function(appId, memberId, cb) {
	assert(typeof appId == 'number');
	assert(typeof memberId == 'number');
	assert(typeof cb === 'function');
    
	var self = this;
	var updateStatement;
    
	this.getReviewStatus(appId, memberId, function(err, status) {
		if (err) return cb(err);
		if(status === 'In-Progress') {
			updateStatement = self.utils.createUpdateStatement(
				'application_review', ['Status'], ['"Draft"'], ['committeeId', 
					'appId'], [memberId, appId]);
			self.conn.query(updateStatement, cb);
		} else {
			err = new Error('Application ' + appId + ' is in ' + status + 
            ' stage by member ' + memberId);
			return cb(err);
		}
	});
};

/**
 * Complete a review.
 * @param {Number} appId 
 * @param {Number} memberId
 * @param {Function} cb
 */
Review.prototype.completeReview = function(appId, memberId, cb) {
	assert(typeof appId == 'number');
	assert(typeof memberId == 'number');
	assert(typeof cb === 'function');
    
	var self = this;
	var updateStatement;
    
	this.getReviewStatus(appId, memberId, function(err, status) {
		if (err) return cb(err);
		if(status === 'In-Progress') {
			self.getCommitteeRank(appId, memberId, function(err, cRank) {
				if (err) return cb(err);
				if(cRank != null) {
					updateStatement = self.utils.createUpdateStatement(
						'application_review', ['Status'], ['"Reviewed"'], 
						['committeeId', 'appId'], [memberId, appId]);
					self.conn.query(updateStatement, cb);
				} else {
					err = new Error('Application ' + appId + 
                    ' by member ' + memberId + ' does not have a valid rank');
					return cb(err);
				}
			});
		} else {
			err = new Error('Application ' + appId + 
                ' is in ' + status + ' stage by member ' + memberId);
			return cb(err);
		}
	});
};

/**
 * Submit a reviewed application.
 * @param {Number} appId 
 * @param {Number} memberId
 * @param {Function} cb
 */
Review.prototype.submitReview = function(appId, memberId, cb) {
	assert(typeof appId == 'number');
	assert(typeof memberId == 'number');
	assert(typeof cb === 'function');
    
	var self = this;
	var updateStatement;
    
	this.getReviewStatus(appId, memberId, function(err, status) {
		if (err) return cb(err);
		if(status === 'Reviewed') {
			updateStatement = self.utils.createUpdateStatement(
				'application_review', ['Status'], ['"Submitted"'], 
				['committeeId', 'appId'], [memberId, appId]);
			self.conn.query(updateStatement, function(err, results) {
				if (err) return cb(err);
				assert(1, results.length);
				self.getCommitteeRanks(appId, function(err, cRanks) {
					if (err) return cb(err);
					updateStatement = self.utils.createUpdateStatement(
						'application', ['Rank'], ['\'' + JSON.stringify(cRanks) 
						+ '\''], ['app_Id'], [appId]);
					self.conn.query(updateStatement, cb);
				});
			});
		} else {
			err = new Error('Application ' + appId + 
                ' is in ' + status + ' stage by member ' + memberId);
			return cb(err);
		}
	});
};

/**
 * Returns true if app is assigned to member fo review.
 * @param {Number} appId 
 * @param {Number} memberId 
 * @param {Function} cb 
 */
Review.prototype.isAssigned = function(appId, memberId, cb) {
	assert(typeof appId == 'number');
	assert(typeof memberId == 'number');
	assert(typeof cb === 'function');

	this.conn.query('Select * from application_review where appId = ? and ' + 
    'committeeId = ?', [appId, memberId], function(err, results) {
		if (err) return cb(err);
		assert(1, results.length);
		return cb(err, results.length === 1);
	});
};

/**
 * Returns true if app is submitted after review.
 * @param {Number} appId 
 * @param {Function} cb 
 */
Review.prototype.isSubmitted = function(appId, cb) {
	assert(typeof appId == 'number');
	assert(typeof cb === 'function');

	this.conn.query('Select * from application_review where appId = ? and ' + 
		'Status = "Submitted"', [appId], 
	function(err, results) {
		if (err) return cb(err);
		assert(1, results.length);
		return cb(err, results.length > 0);
	});
};

/**
 * Get the review status of an application assigned to a member.
 * @param {Number} appId 
 * @param {Number} memberId 
 * @param {Function} cb 
 */
Review.prototype.getReviewStatus = function(appId, memberId, cb) {
	assert(typeof appId == 'number');
	assert(typeof memberId == 'number');
	assert(typeof cb === 'function');
    
	var self = this;
    
	this.isAssigned(appId, memberId, function(err, result) {
		if (err) return cb(err);
		else if(!result) {
			err = new Error('Application ' + appId + 
            ' is not assigned to member ' + memberId);
			return cb(err);
		} else {
			self.conn.query('Select * from application_review where appId = ? ' 
            + 'and committeeId = ?', [appId, memberId], function(err, results) {
				if (err) return cb(err);
				assert(1, results.length);
				return cb(err, results[0]['Status']);
			});
		}
	});
};

/**
 * Get the commmittee rank of an application assigned to a member.
 * @param {Number} appId 
 * @param {Number} memberId 
 * @param {Function} cb 
 */
Review.prototype.getCommitteeRank = function(appId, memberId, cb) {
	assert(typeof appId == 'number');
	assert(typeof memberId == 'number');
	assert(typeof cb === 'function');
    
	var self = this;
    
	this.isAssigned(appId, memberId, function(err, result) {
		if (err) return cb(err);
		else if(!result) {
			err = new Error('Application ' + appId + 
            ' is not assigned to member ' + memberId);
			return cb(err);
		} else {
			self.conn.query('Select * from application_review where appId = ? ' 
            + 'and committeeId = ?', [appId, memberId], function(err, results) {
				if (err) return cb(err);
				assert(1, results.length);
				return cb(err, results[0]['c_Rank']);
			});
		}
	});
};

/**
 * Get all the committee rank for the particular app.
 * @param {Number} appId 
 * @param {Function} cb
 */
Review.prototype.getCommitteeRanks = function(appId, cb) {
	assert(typeof appId == 'number');
	assert(typeof cb === 'function');
    
	var self = this;

	self.conn.query('Select c_Rank from application_review where ' + 
    'appId = ? and Status = "Submitted"', [appId], 
	function(err, results) {
		if (err) return cb(err);
		var cRanks = [];
		if (results.length === 2) {
			_.forEach(results, function(res) {
				var rank = res['c_Rank'];
				cRanks.push(rank); 
			});
		}
		return cb(err, cRanks);
	});
};


module.exports = Review;
