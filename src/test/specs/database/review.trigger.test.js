'use strict';

var assert = require('assert');
var async = require('async');
var config = require('../../lib/utils/config');
var mysql = require('mysql2');

var Review = require('../../../controller/review');

var connection, review;
var creds = config.credentials.database;

describe('Review Triggers', function() {
	before(function overallSetup(done) {
		connection = mysql.createConnection(creds);
		review = new Review(connection);
		connection.connect(done);
	});
    
	after(function overallCleanUp(done) {
		connection.end(done);
	});

	describe('assign a review', function() {
		after(function cleanUp(done) {
			review.unassignReview(12, 20, 1, done);
		});
            
		it('assign a valid review to a valid committee member', 
			function(done) {
				review.assignReview(12, 20, 1, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
			});

		it('assign a valid review by a not logged in faculty member', 
			function(done) {
				review.assignReview(12, 20, 2, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('assign a valid review by a not an admin', 
			function(done) {
				review.assignReview(12, 20, 19, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('assign a valid review to an invalid committee member', 
			function(done) {
				review.assignReview(12, 0, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});
            
		it('assign an invalid review to a valid committee member', 
			function(done) {
				review.assignReview(0, 20, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});

		it('assign an invalid review to an invalid committee member', 
			function(done) {
				review.assignReview(0, 1, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});
	});

	describe('unassign a review', function() {
		before(function setUp(done) {
			review.assignReview(12, 20, 1, done);
		});

		it('unassign a valid review by an invalid admin', 
			function(done) {
				review.unassignReview(12, 20, 19, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});
                
		it('unassign a completed review from a committee member', 
			function(done) {
				review.unassignReview(19, 17, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});
                
		it('unassign a submited review from a committee member', 
			function(done) {
				review.unassignReview(16, 11, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('unassign a valid review from an valid committee member', 
			function(done) {
				review.unassignReview(12, 20, 1, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
			});
            
		it('unassign a valid review from an invalid committee member', 
			function(done) {
				review.unassignReview(17, 1, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('uassign an invalid review from valid committee member', 
			function(done) {
				review.unassignReview(0, 20, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});
                
		it('unassign an invalid review from invalid committee member', 
			function(done) {
				review.unassignReview(0, 1, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});
	});

	describe('dismiss a review', function() {
		before(function setUp(done) {
			review.assignReview(12, 20, 1, done);
		});

		after(function cleanUp(done){
			review.unassignReview(12, 20, 1, done);
		});

		it('dismiss a valid review by an invalid admin', 
			function(done) {
				review.dismissReview(12, 20, 19, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});
                
		it('dismiss a completed review from a committee member', 
			function(done) {
				review.dismissReview(19, 17, 1, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
			});
                
		it('dismiss a submited review from a committee member', 
			function(done) {
				review.dismissReview(16, 11, 1, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
			});

		it('dismiss a not submitted review from a valid committee member', 
			function(done) {
				review.dismissReview(12, 20, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});
            
		it('dismiss a valid review from an invalid committee member', 
			function(done) {
				review.dismissReview(17, 1, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('dismiss an invalid review from valid committee member', 
			function(done) {
				review.dismissReview(0, 20, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});
                
		it('dismiss an invalid review from invalid committee member', 
			function(done) {
				review.dismissReview(0, 1, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});
	});
        
	describe('remind a review', function() {
		before(function setUp(done) {
			review.assignReview(12, 20, 1, done);
		});

		after(function cleanUp(done) {
			review.unassignReview(12, 20, 1, done);
		});

		it('remind a review by an invalid admin', 
			function(done) {
				review.remindReview(16, 11, 19, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should exist');
						done();
					});
			});

		it('remind a submitted review to a committee member', 
			function(done) {
				review.remindReview(16, 11, 1, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should exist');
						done();
					});
			});

		it('remind a valid review by a valid admin to a valid committee member', 
			function(done) {
				review.remindReview(12, 20, 1, 
					function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						done();
					});
			});
        
		it('remind a valid review by a valid admin to an invalid committee member', 
			function(done) {
				review.remindReview(17, 1, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('remind a valid review by an invalid admin to a valid committee member', 
			function(done) {
				review.remindReview(17, 20, 13, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('remind a valid review by an invalid admin to an invalid committee member', 
			function(done) {
				review.remindReview(17, 9, 3, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('remind an invalid review by a valid admin to valid committee member', 
			function(done) {
				review.remindReview(0, 20, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});

		it('remind an invalid review by a valid admin to an invalid committee member', 
			function(done) {
				review.remindReview(0, 9, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});

		it('remind an invalid review by an invalid admin to valid committee member', 
			function(done) {
				review.remindReview(0, 20, 3, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});

		it('remind an invalid review by an invalid admin to an invalid committee member', 
			function(done) {
				review.remindReview(0, 9, 3, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});
	});

	describe('load a review', function() {
		before(function setUp(done) {
			review.assignReview(12, 20, 1, done);
		});

		after(function cleanUp(done) {
			review.unassignReview(12, 20, 1, done);
		});
		
		it('load a valid review by a valid member', 
			function(done) {
				review.loadReview(12, 20, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
			});

		it('load a valid review by an invalid member', 
			function(done) {
				review.loadReview(12, 3, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});

		it('load a invalid review by a valid member', 
			function(done) {
				review.loadReview(0, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});

		it('load a invalid review by an invalid member', 
			function(done) {
				review.loadReview(0, 3, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});
	});

	describe('save a review', function() {
		before(function setUp(done) {
			async.series([
				function(callback) {
					review.assignReview(12, 20, 1, callback);
				}
			], done);
		});

		after(function cleanUp(done) {
			async.series([
				function(callback) {
					review.saveReview(12, 20, {}, callback);
				},
				function(callback) {
					review.unassignReview(12, 20, 1, callback);
				},
				function(callback) {
					review.removeUniversity('York University', callback);
				}
			], done);
		});

		it('save a review with null data', function(done) {
			review.saveReview(12, 20, null, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});

		it('save a review with no data', function(done) {
			review.saveReview(12, 20, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});

		it('save a review with data', 
			function(done) {
				var data = {
					LName: 'Bar',
					FName: 'Foo',
					GPA: 'B+',
					GRE: '150',
					Degree: 'MSc',
					PreviousInst: ['York University'],
					UniAssessment: [{'u_Name': 'York University', 'u_Assessments': 'Well known in Ontario'}],
					Background: 'Strong programmer',
					researchExp: 'None',
					Comments: 'None',
					c_Rank: 'B+'
				};
				review.saveReview(12, 20, data, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
			});

		it('save a submitted review as a committee member', 
			function(done) {
				review.saveReview(16, 11, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});
            
		it('save a valid review as an invalid committee member', 
			function(done) {
				review.saveReview(17, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('save an invalid review as a valid committee member', 
			function(done) {
				review.saveReview(0, 20, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});

		it('save an invalid review as an invalid committee member', 
			function(done) {
				review.saveReview(0, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});
	});

	describe('submit a review', function() {
		before(function setUp(done) {
			async.series([
				function(callback) {
					review.assignReview(12, 20, 1, callback);
				},
				function(callback) {
					review.assignReview(11, 20, 1, callback);
				},
				function(callback) {
					review.saveReview(12, 20, {c_Rank: 'B+'}, callback);
				}
			], done);
		});
		
		it('submit a submitted review as a committee member', 
			function(done) {
				review.submitReview(16, 11, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('submit a valid review with valid committee member w/o a committee rank', 
			function(done) {
				review.submitReview(11, 20, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('submit a valid review with valid committee member w/ a committee rank', 
			function(done) {
				review.submitReview(12, 20, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
			});
            
		it('submit a valid review with an invalid committee member', 
			function(done) {
				review.submitReview(20, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('submit an invalid review with valid committee member', 
			function(done) {
				review.submitReview(0, 20, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});

		it('submit an invalid review with an invalid committee member', 
			function(done) {
				review.submitReview(0, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});
	});

	describe('helper functions', function() {
		describe('isSubmitted', function() {
			it('check if a valid app is submitted', function(done) {
				review.isSubmitted(12, function(err, result) {
					if (err) return done(err);
					assert(result, 'Result should exist');
					done();
				});
			});

			it('check if an valid app is submitted', function(done) {
				review.isSubmitted(0, function(err, result) {
					if (err) return done(err);
					assert(!result, 'Result should not exist');
					done();
				});
			});
		});

		describe('setReviewStatus', function() {
			it('set reviewed status to "New"', function(done) {
				review.setReviewStatus(12, 20, 'New', function(err, result) {
					if (err) done (err);
					assert(result, 'Result should exist');
					done();
				});
			});

			it('set reviewed status to "Draft"', function(done) {
				review.setReviewStatus(12, 20, 'New', function(err, result) {
					if (err) done (err);
					assert(result, 'Result should exist');
					done();
				});
			});

			it('set reviewed status to "Submitted"', function(done) {
				review.setReviewStatus(12, 20, 'Submitted', function(err, result) {
					if (err) done (err);
					assert(result, 'Result should exist');
					done();
				});
			});

			it('set reviewed status to a not accepted value', function(done) {
				review.setReviewStatus(12, 20, 'abcd', function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});

			it('set reviewed status of an unassigned app', function(done) {
				review.setReviewStatus(0, 20, 'abcd', function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});
		});

		describe('getCommitteeRank', function() {
			it('get a committee rank of an application not assigned to a member', 
				function(done) {
					review.getCommitteeRank(16, 12, function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
				});

			it('get a committee rank of an application assigned to a member', 
				function(done) {
					review.getCommitteeRank(12, 20, function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						done();
					});
				});
		});

		describe('addUniAssessment', function() {
			after(function(done) {
				review.removeUniversity('York University', done);
			});

			it('add an new university assessment', function(done) {
				review.addUniAssessment([{'u_Name': 'York University', 
					'u_Assessments': 'Well Known'}], function(err, result) {
					if (err) return done(err);
					assert(result, 'Result should exist');
					done();
				});
			});

			it('add an assessment to existing university', function(done) {
				review.addUniAssessment([{'u_Name': 'York University', 
					'u_Assessments': 'Well Known2'}], function(err, result) {
					if (err) return done(err);
					assert(result, 'Result should exist');
					done();
				});
			});
		});

		describe('autoFillReviewInfo', function() {
			it('auto fill review info of valid app', function(done) {
				review.autoFillReviewInfo(12, function(err, result) {
					if (err) return done(err);
					assert(result, 'Result should exist');
					done();
				});
			});

			it('auto fill review info of invalid app', function(done) {
				review.autoFillReviewInfo(0, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});
		});

		describe('getReviewAssignedDate', function() {
			it('get review assigned date of an invalid application w/ valid committee member', 
				function(done) {
					review.getReviewAssignedDate(0, 12, function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
				});

			it('get review assigned date of an invalid application w/ invalid committee member', 
				function(done) {
					review.getReviewAssignedDate(0, 0, function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
				});

			it('get review assigned date of an valid application w/ invalid committee member', 
				function(done) {
					review.getReviewAssignedDate(8, 0, function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should not exist');
						done();
					});
				});

			it('get review assigned date of an valid application w/ valid committee member', 
				function(done) {
					review.getReviewAssignedDate(12, 20, function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						done();
					});
				});
		});

		describe('getReviewAssigneeID', function() {
			it('get reviewers id of a valid app', 
				function(done) {
					review.getReviewAssigneeID(12, function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						done();
					});
				});
		});

		describe('getReviewCount', function() {
			it('get reviewer count of an invalid app', 
				function(done) {
					review.getReviewCount(0, function(err, result) {
						if (err) done(err);
						assert(!result, 'Result should be false');
						done();
					});
				});

			it('get reviewer count of a valid app', 
				function(done) {
					review.getReviewCount(12, function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						done();
					});
				});
		});

		describe('getAppCount', function() {
			it('get app count of an invalid member', 
				function(done) {
					review.getAppCount(0, function(err, result) {
						if (err) done(err);
						assert(!result, 'Result should be false');
						done();
					});
				});

			it('get app count of a valid member', 
				function(done) {
					review.getAppCount(11, function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						done();
					});
				});
		});
	});
});
