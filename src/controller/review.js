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
 * Open a review.
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
					} else {
						err = new Error('No application review found for app ' 
							+ appId + ' by committee member ' + committeeId);
						return cb(err);
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
		LName: data['LName'] ? JSON.stringify(data['LName']) : null,
		FName:  data['FName'] ? JSON.stringify(data['FName']) : null,
		GPA: data['GPA'] ? JSON.stringify(data['GPA']) : null,
		GRE: data['GRE'] ? JSON.stringify(data['GRE']) : null,
		Degree: data['Degree'] ? JSON.stringify(data['Degree']) : null,
		PreviousInst: data['PreviousInst'] ? 
			JSON.stringify(data['PreviousInst']) : null,
		UniAssessment: data['UniAssessment'] ? JSON.stringify(JSON
			.stringify(data['UniAssessment'])) : null,
		Background: data['Background'] ? JSON.stringify(data['Background']) 
			: null,
		researchExp: data['researchExp'] ? JSON.stringify(data['researchExp']) 
			: null,
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
						'application_review', ['Status', 'LName', 'FName', 'GPA', 'GRE', 
							'Degree', 'PreviousInst', 'UniAssessment', 'Background', 
							'researchExp', 'Comments', 'c_Rank'], ['"Draft"', 
							dt.LName, dt.FName, 
							dt.GPA, dt.GRE, 
							dt.Degree, 
							dt.PreviousInst, 
							dt.UniAssessment, 
							dt.Background, 
							dt.researchExp, 
							dt.Comments, dt.c_Rank], 
						['committeeId', 'appId'], [committeeId, appId]);
					self.conn.query(updateStatement, function(err, result) {
						if (err) return cb(err);
						if (result && result.affectedRows === 1) {
							if (dt.PreviousInst && assesmentArray)
								self.addUniAssessment(dt.PreviousInst, assesmentArray, cb);
							else return cb(err, result.affectedRows === 1);
						}
						else {
							err = new Error('Could not save review for app ' + appId);
							return cb(err);
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

Review.prototype.addUniAssessment = function(uni, assessment, cb) {
	assert(typeof uni === 'string');
	assert(Array.isArray(assessment));
	assert(typeof cb === 'function');

	var self = this;
	var updateStatement, insertStmt;

	this.conn.query('select * from university where u_Name=' + uni, function(err, result) {
		if (err) return cb(err);
		var assmt = [];
		if (result.length === 1) {
			for (var i = 0; i < assessment.length; i++) {
				if (typeof assessment[i] !== 'undefined')
					assmt.push(assessment[i]);
			}
			var prevAssessment = _.uniq(result[0]['u_Assessments'].concat(assmt));
			updateStatement = self.utils.createUpdateStatement('university', 
				['u_Name', 'u_Assessments'], [uni, JSON.stringify(JSON.stringify(prevAssessment))], ['u_Name'], 
				[uni]);
			self.conn.query(updateStatement, function(err, result) {
				if (err) return cb(err);
				if (result && result.affectedRows === 1)
					return cb(err, result.affectedRows === 1);
				else {
					err = new Error('Could not update record for university: ' + JSON.stringify(uni));
					return cb(err);
				}
			});
		} else if (result.length === 0) {
			for (var j = 0; j < assessment.length; j++) {
				if (typeof assessment[j] !== 'undefined')
					assmt.push(assessment[j]);
			}
			insertStmt = self.utils.createInsertStatement('university', 
				['u_Name', 'u_Assessments'], [uni, JSON.stringify(JSON.stringify(assmt))]);
			self.conn.query(insertStmt, function(err, result) {
				if (err) return cb(err);
				if (result && result.affectedRows === 1)
					return cb(err, true);
				else {
					err = new Error('Could not create a new record for university: ' 
					+ JSON.stringify(uni));
					return cb(err);
				}
			});
		} 	else {
			err = new Error('Multiple records found for university: ' + 
			JSON.stringify(uni));
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
		if (results.length === 2) {
			_.forEach(results, function(res) {
				var rank = res['c_Rank'];
				cRanks.push(rank); 
			});
		}
		return cb(err, cRanks);
	});
};

/**
 * Get review information given app id
 * @param {Number} appId
 * @param {Function} cb 
 */
Review.prototype.autoFillReviewInfo = function(appId, cb) {
	var sql = 'select lname, fname, degree, gpa, gre from application where app_Id=?';
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

module.exports = Review;
