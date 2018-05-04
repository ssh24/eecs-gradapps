'use strict';

var _ = require('lodash');
var assert = require('assert');

var Utils = require('./utils');

var Review = function(connection) {
	this.conn = connection;
	this.utils = new Utils(this.conn);
};

/**
 * Assign an application for review to a committee member by an admin.
 * @param {Number} appId 
 * @param {Number} committeeId 
 * @param {Number} adminId 
 * @param {Function} cb 
 */
Review.prototype.assignReview = function(appId, committeeId, adminId, cb) {
	assert(typeof appId == 'number');
	assert(typeof committeeId == 'number');
	assert(typeof adminId == 'number');
	assert(typeof cb === 'function');
    
	var self = this;
	var insertStmt;
	
	this.utils.getRoles(adminId, function(err, roles) {
		if (err) return cb (err);
		if (roles.includes('Admin')) {
			self.utils.hasRole(committeeId, 'Committee Member', 
				function(err, result) {
					if (err) return cb(err);
					if (result) {
						insertStmt = self.utils.
							createInsertStatement('application_review', 
								['committeeId', 'appId', 'Status'], 
								[committeeId, appId, '"New"']);
						self.conn.query(insertStmt, cb);
					} else {
						err = new Error('Member ' + committeeId + 
								' is not a committee member');
						return cb(err);
					}
				});
		} else {
			err = new Error('Member ' + adminId + ' cannot assign a review'); 
			return cb(err);
		}
	});
};

/**
 * Unassign an application for review from a committee member by an admin.
 * @param {Number} appId 
 * @param {Number} committeeId 
 * @param {Number} adminId 
 * @param {Function} cb 
 */
Review.prototype.unassignReview = function(appId, committeeId, adminId, cb) {
	assert(typeof appId == 'number');
	assert(typeof committeeId == 'number');
	assert(typeof adminId == 'number');
	assert(typeof cb === 'function');
    
	var self = this;
	var deleteStmt;

	this.utils.getRoles(adminId, function(err, roles) {
		if (err) return cb (err);
		if (roles.includes('Admin')) {
			self.getReviewStatus(appId, committeeId, function(err, status) {
				if (err) return cb(err);
				if(status === 'New' || status === 'Draft') {
					deleteStmt = self.utils.
						createDeleteStatement('application_review', 
							['committeeId', 'appId'], [committeeId, 
								appId]);
					self.conn.query(deleteStmt, cb);
				} else {
					err = new Error('Application ' + appId + 
							' has been submitted by ' + 
							'member ' + committeeId);
					return cb(err);
				}
			});
		} else {
			err = new Error('Member ' + adminId + ' cannot unassign a review'); 
			return cb(err);
		}
	});
};

/**
 * Dismiss a submitted review from committee.
 * @param {Number} appId 
 * @param {Number} committeeId 
 * @param {Number} adminId 
 * @param {Function} cb 
 */
Review.prototype.dismissReview = Review.prototype.deleteReview = 
function(appId, committeeId, adminId, cb) {
	assert(typeof appId == 'number');
	assert(typeof committeeId == 'number');
	assert(typeof adminId == 'number');
	assert(typeof cb === 'function');
    
	var self = this;
	var deleteStmt;

	this.utils.getRoles(adminId, function(err, roles) {
		if (err) return cb (err);
		if (roles.includes('Admin')) {
			self.getReviewStatus(appId, committeeId, function(err, status) {
				if (err) return cb(err);
				if(status === 'Submitted') {
					deleteStmt = self.utils.
						createDeleteStatement('application_review', 
							['committeeId', 'appId'], [committeeId, 
								appId]);
					self.conn.query(deleteStmt, cb);
				} else {
					err = new Error('Application ' + appId + 
							' has not been submitted by ' + 
							'member ' + committeeId);
					return cb(err);
				}
			});
		} else {
			err = new Error('Member ' + adminId + ' cannot dismiss a review'); 
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
Review.prototype.remindReview = function(appId, committeeId, adminId, cb) {
	assert(typeof appId == 'number');
	assert(typeof committeeId == 'number');
	assert(typeof adminId == 'number');
	assert(typeof cb === 'function');
    
	var self = this;
	var updateStatement;

	this.utils.getRoles(adminId, function(err, roles) {
		if (err) return cb (err);
		if (roles.includes('Admin')) {
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
			err = new Error('Member ' + adminId + ' cannot remind a review'); 
			return cb(err);
		}
	});
};

/**
 * Load review details.
 * @param {Number} appId 
 * @param {Number} committeeId
 * @param {Function} cb
 */
Review.prototype.loadReview = function(appId, committeeId, cb) {
	assert(typeof appId == 'number');
	assert(typeof committeeId == 'number');
	assert(typeof cb === 'function');
    
	var self = this;
	
	this.utils.getRoles(committeeId, function(err, roles) {
		if (err) return cb (err);
		if (roles.includes('Committee Member')) {
			self.getReviewStatus(appId, committeeId, function(err) {
				if (err) return cb(err);
				self.conn.query('Select * from application_review where ' + 
							'committeeId = ? and appId = ?', 
				[committeeId, appId], 
				function(err, results) {
					if (err) return cb(err);
					if (results && results.length === 1) {
						return cb(err, results);
					}
				});
			});
		} else {
			err = new Error('Member ' + committeeId + ' cannot open a review'); 
			return cb(err);
		}
	});
};

/**
 * Save an on-going review.
 * @param {Number} appId 
 * @param {Number} committeeId
 * @param {Function} cb
 */
Review.prototype.saveReview = function(appId, committeeId, data, cb) {
	if (typeof data === 'function') {
		cb = data;
		data = {};
	}
	data = data || {}; 
	assert(typeof appId == 'number');
	assert(typeof committeeId == 'number');
	assert(typeof data === 'object');
	assert(typeof cb === 'function');
    
	var self = this;
	var updateStatement;

	var dt = {
		PreviousInst: data['PreviousInst'] ? JSON.stringify(JSON.stringify(
			data['PreviousInst'])) : null,
		UniAssessment: data['UniAssessment'] ? JSON.stringify(JSON.stringify(
			data['UniAssessment'])) : null,
		Background: data['Background'] ? JSON.stringify(data['Background']) 
			: null,
		researchExp: data['researchExp'] ? JSON.stringify(data['researchExp']) 
			: null,
		Letter: data['Letter'] ? JSON.stringify(data['Letter']) : null,
		Comments: data['Comments'] ? JSON.stringify(data['Comments']) : null,
		c_Rank: data['c_Rank'] ? JSON.stringify(data['c_Rank']) : null
	};

	var assesmentArray;
	if (dt.UniAssessment) {
		assesmentArray = data['UniAssessment'];
	}

	this.utils.getRoles(committeeId, function(err, roles) {
		if (err) return cb (err);
		if (roles.includes('Committee Member')) {
			self.getReviewStatus(appId, committeeId, function(err, status) {
				if (err) return cb(err);
				if(status === 'New' || status === 'Draft') {
					updateStatement = self.utils.createUpdateStatement(
						'application_review', ['Status', 'PreviousInst', 
							'UniAssessment', 'Background', 
							'researchExp', 'Letter', 'Comments', 'c_Rank'], 
						['"Draft"', dt.PreviousInst, dt.UniAssessment, 
							dt.Background, dt.researchExp, dt.Letter,
							dt.Comments, dt.c_Rank], 
						['committeeId', 'appId'], [committeeId, appId]);
					self.conn.query(updateStatement, function(err, result) {
						if (err) return cb(err);
						if (result && result.affectedRows === 1) {
							if (assesmentArray)
								self.addUniAssessment(assesmentArray, cb);
							else return cb(err, result.affectedRows === 1);
						}
					});
				} else {
					err = new Error('Application ' + appId + ' is in ' + status + 
					' stage by member ' + committeeId);
					return cb(err);
				}
			});
		} else {
			err = new Error('Member ' + committeeId + ' cannot save a review'); 
			return cb(err);
		}
	});
};

/**
 * Submit a reviewed application.
 * @param {Number} appId 
 * @param {Number} committeeId
 * @param {Function} cb
 */
Review.prototype.submitReview = function(appId, committeeId, cb) {
	assert(typeof appId == 'number');
	assert(typeof committeeId == 'number');
	assert(typeof cb === 'function');
    
	var self = this;
	var updateStatement;
	
	this.utils.getRoles(committeeId, function(err, roles) {
		if (err) return cb (err);
		if (roles.includes('Committee Member')) {
			self.getReviewStatus(appId, committeeId, function(err, status) {
				if (err) return cb(err);
				if (status != 'Submitted') {
					self.conn.query('select c_Rank from application_review where ' + 
					'committeeId=? and appId=?', [committeeId, appId], 
					function(err, result) {
						if (err) return cb(err);
						if (result && result.length === 1 && result[0]['c_Rank'] 
						!= null) {
							updateStatement = self.utils.createUpdateStatement(
								'application_review', ['Status'], ['"Submitted"'], 
								['committeeId', 'appId'], [committeeId, appId]);
							self.conn.query(updateStatement, function(err, results) {
								if (err) return cb(err);
								assert(1, results.length);
								self.getCommitteeRanks(appId, function(err, cRanks) {
									if (err) return cb(err);
									updateStatement = self.utils.createUpdateStatement(
										'application', ['Rank'], ['\'' + 
										JSON.stringify(cRanks) + '\''], ['app_Id'], 
										[appId]);
									self.conn.query(updateStatement, cb);
								});
							});
						} else {
							err = new Error('Cannot submit a review without a committee rank');
							return cb(err);
						}
					});
				} else {
					err = new Error('Application ' + appId + 
					' has been submitted by member ' + committeeId);
					return cb(err);
				}
			});
		} else {
			err = new Error('Member ' + committeeId + ' cannot submit a review'); 
			return cb(err);
		}
	});
};

/**
 * Returns true if app is assigned to member fo review.
 * @param {Number} appId 
 * @param {Number} committeeId 
 * @param {Function} cb 
 */
Review.prototype.isAssigned = function(appId, committeeId, cb) {
	assert(typeof appId == 'number');
	assert(typeof committeeId == 'number');
	assert(typeof cb === 'function');

	this.conn.query('Select * from application_review where appId = ? and ' + 
    'committeeId = ?', [appId, committeeId], function(err, results) {
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
 * @param {Number} committeeId 
 * @param {Function} cb 
 */
Review.prototype.getReviewStatus = function(appId, committeeId, cb) {
	assert(typeof appId == 'number');
	assert(typeof committeeId == 'number');
	assert(typeof cb === 'function');
    
	var self = this;
    
	this.isAssigned(appId, committeeId, function(err, result) {
		if (err) return cb(err);
		else if(!result) {
			err = new Error('Application ' + appId + 
            ' is not assigned to member ' + committeeId);
			return cb(err);
		} else {
			self.conn.query('Select * from application_review where appId = ? ' 
            + 'and committeeId = ?', [appId, committeeId], function(err, results) {
				if (err) return cb(err);
				assert(1, results.length);
				return cb(err, results[0]['Status']);
			});
		}
	});
};

/**
 * Get the review assigned date.
 * @param {Number} appId 
 * @param {Number} committeeId 
 * @param {Function} cb 
 */
Review.prototype.getReviewAssignedDate = function(appId, committeeId, cb) {
	assert(typeof appId == 'number');
	assert(typeof committeeId == 'number');
	assert(typeof cb === 'function');
    
	var self = this;
    
	this.isAssigned(appId, committeeId, function(err, result) {
		if (err) return cb(err);
		else if(!result) {
			err = new Error('Application ' + appId + 
            ' is not assigned to member ' + committeeId);
			return cb(err);
		} else {
			self.conn.query('Select DATE_FORMAT(assignDate, "%m/%d/%Y") as `Date Assigned` from application_review where appId = ? ' 
            + 'and committeeId = ?', [appId, committeeId], function(err, results) {
				if (err) return cb(err);
				assert(1, results.length);
				return cb(err, results[0]['Date Assigned']);
			});
		}
	});
};

/**
 * set the review status of an application assigned to a member.
 * @param {Number} appId 
 * @param {Number} committeeId 
 * @param {Function} cb 
 */
Review.prototype.setReviewStatus = function(appId, committeeId, status, cb) {
	assert(typeof appId == 'number');
	assert(typeof committeeId == 'number');
	assert(typeof status == 'string');
	assert(typeof cb === 'function');
    
	var self = this;
	var updateStatement;
	var statusArray = ['New', 'Draft', 'Submitted'];

	if(!statusArray.includes(status)) {
		var err = new Error('Invalid status');
		return cb(err);
	}
    
	this.isAssigned(appId, committeeId, function(err, result) {
		if (err) return cb(err);
		else if(!result) {
			err = new Error('Application ' + appId + 
            ' is not assigned to member ' + committeeId);
			return cb(err);
		} else {
			updateStatement = self.utils.createUpdateStatement('application_review', 
				['Status'], [JSON.stringify(status)], ['appId', 'committeeId'], [appId, 
					committeeId]);
			self.conn.query(updateStatement, function(err, results) {
				if (err) return cb (err);
				if (results && results.affectedRows)
					return cb(err, results.affectedRows === 1);
			});
		}
	});
};

/**
 * Get the commmittee rank of an application assigned to a member.
 * @param {Number} appId 
 * @param {Number} committeeId 
 * @param {Function} cb 
 */
Review.prototype.getCommitteeRank = function(appId, committeeId, cb) {
	assert(typeof appId === 'number');
	assert(typeof committeeId == 'number');
	assert(typeof cb === 'function');
    
	var self = this;
    
	this.isAssigned(appId, committeeId, function(err, result) {
		if (err) return cb(err);
		else if(!result) {
			err = new Error('Application ' + appId + 
            ' is not assigned to member ' + committeeId);
			return cb(err);
		} else {
			self.conn.query('Select * from application_review where appId = ? ' 
            + 'and committeeId = ?', [appId, committeeId], function(err, results) {
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
	assert(typeof appId === 'number');
	assert(typeof cb === 'function');

	this.conn.query('Select c_Rank from application_review where ' + 
    'appId = ? and Status = "Submitted"', [appId], 
	function(err, results) {
		if (err) return cb(err);
		var cRanks = [];
		if (results.length === 2) { // domestic students
			_.forEach(results, function(res) {
				var rank = res['c_Rank'];
				cRanks.push(rank); 
			});
		} else {
			// visa students
			cRanks.push(results[0]['c_Rank']);
		}
		return cb(err, cRanks);
	});
};

/**
 * Get review information given app id.
 * @param {Number} appId
 * @param {Function} cb 
 */
Review.prototype.autoFillReviewInfo = function(appId, cb) {
	assert(typeof appId === 'number');
	assert(typeof cb === 'function');

	var sql = 'select student_Id, lname, fname, degree, gpa, gre, toefl, ielts, yelt from application where app_Id=?';
	this.conn.query(sql, [appId], function(err, result) {
		if (err) return cb(err);
		if(result.length === 1) {
			return cb(err, result);
		} else {
			err = new Error('No application selected for review');
			return cb(err);
		}
	});
};

/**
 * Add an assessment for university.
 * @param {String} uni 
 * @param {Array} assessment 
 * @param {Function} cb 
 */
Review.prototype.addUniAssessment = function(assessment, cb) {
	assert(Array.isArray(assessment));
	assert(typeof cb === 'function');

	var self = this;
	var query = '';

	this.conn.query('select u_Name, u_Assessments from university', function(err, result) {
		if (err) return cb(err);
		if (result) {
			_.forEach(assessment, function(res1) {
				var uni = res1['u_Name'];
				var assmt = res1['u_Assessments'];

				var inst = _.find(result, function(res) {
					return res['u_Name'] === uni;
				});

				// did not find instance, so it is a new university
				if(_.isEmpty(inst)) {
					var insert = self.utils.createInsertStatement('university', 
						['u_Name', 'u_Assessments'], [JSON.stringify(uni), 
							JSON.stringify(JSON.stringify(assmt))]) + ';';
					query += insert;
				} else { // update an instance
					var foundDiff = false;
					_.forEach(assmt, function(ast) {
						if (!inst['u_Assessments'].includes(ast)) foundDiff = true;
					});
	
					if (foundDiff) {
						var prevAssessment = _.uniq(inst['u_Assessments'].concat(assmt));
						var updt = self.utils.createUpdateStatement('university', 
							['u_Assessments'], [JSON.stringify(JSON.stringify(prevAssessment))],
							['u_Name'], [JSON.stringify(uni)]) + ';';
						query += updt;
					}
				}
			});
			if (query != '') return self.conn.query(query, cb);
			else return cb(err, result);
		} else {
			err = new Error('No record of universities found');
			return cb(err);
		}
	});
};

/** Remove an university assessment
 * @param {String} uni 
 * @param {Function} cb 
 */
Review.prototype.removeUniversity = function(uni, cb) {
	assert(typeof uni === 'string');
	assert(typeof cb === 'function');

	var deleteStmt = this.utils.createDeleteStatement('university', ['u_Name'], 
		[JSON.stringify(uni)]);

	this.conn.query(deleteStmt, cb);
};

/**
 * Get all the assignees of an app.
 * @param {Number} appId 
 * @param {Function} cb
 */
Review.prototype.getReviewAssigneeID = function(appId, cb) {
	assert(typeof appId === 'number');
	assert(typeof cb === 'function');

	this.conn.query('Select committeeId from application_review where ' + 
    'appId = ?', [appId], 
	function(err, results) {
		if (err) return cb(err);
		return cb(err, results);
	});
};

/**
 * Get review count for an app.
 * @param {Number} appId 
 * @param {Function} cb
 */
Review.prototype.getReviewCount = function(appId, cb) {
	assert(typeof appId === 'number');
	assert(typeof cb === 'function');

	this.conn.query('Select * from application_review where ' + 
    'appId = ?', [appId], 
	function(err, results) {
		if (err) return cb(err);
		return cb(err, results.length);
	});
};

/**
 * Get app count for a reviewer
 * @param {Number} committeeId 
 * @param {Function} cb
 */
Review.prototype.getAppCount = function(committeeId, cb) {
	assert(typeof committeeId === 'number');
	assert(typeof cb === 'function');

	this.conn.query('Select * from application_review where ' + 
    'committeeId = ?', [committeeId], 
	function(err, results) {
		if (err) return cb(err);
		return cb(err, results.length);
	});
};

module.exports = Review;
