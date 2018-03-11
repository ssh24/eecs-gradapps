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

		it('unassign a review in-progress from a committee member', 
			function(done) {
				review.unassignReview(17, 16, 1, function(err, result) {
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

	describe('open a review', function() {
		before(function setUp(done) {
			review.assignReview(12, 20, 1, done);
		});

		after(function cleanUp(done) {
			async.series([
				function(callback) {
					review.saveReview(12, 20, callback);
				},
				function(callback) {
					review.unassignReview(12, 20, 1, callback);
				}
			], done);
		});

		it('open a review that has been saved as a draft', function(done) {
			review.openReview(19, 19, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});

		it('open a review as a committee member who already has an opened ' 
			+ 'review in-progress', 
		function(done) {
			review.openReview(21, 16, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should exist');
				done();
			});
		});

		it('open a submitted review as a committee member', 
			function(done) {
				review.openReview(20, 16, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('open a valid review as a valid committee member', 
			function(done) {
				review.openReview(12, 20, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
			});
		
		it('open a valid review as an invalid committee member', 
			function(done) {
				review.openReview(17, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('open an invalid review as a valid committee member', 
			function(done) {
				review.openReview(0, 20, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});

		it('open an invalid review as a invalid committee member', 
			function(done) {
				review.openReview(0, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});
	});

	describe('begin a review', function() {
		before(function setUp(done) {
			review.assignReview(12, 20, 1, done);
		});

		after(function cleanUp(done) {
			async.series([
				function(callback) {
					review.saveReview(12, 20, callback);
				},
				function(callback) {
					review.unassignReview(12, 20, 1, callback);
				}
			], done);
		});

		it('begin a submitted review as a committee member', 
			function(done) {
				review.beginReview(16, 11, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('begin a valid review as a valid committee member', 
			function(done) {
				review.beginReview(12, 20, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
			});
            
		it('begin a valid review as an invalid committee member', 
			function(done) {
				review.beginReview(17, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('begin an invalid review as a valid committee member', 
			function(done) {
				review.beginReview(0, 20, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});

		it('begin an invalid review as a invalid committee member', 
			function(done) {
				review.beginReview(0, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});
	});

	describe('write a review', function() {
		before(function setUp(done) {
			async.series([
				function(callback) {
					review.assignReview(12, 20, 1, callback);
				},
				function(callback) {
					review.beginReview(12, 20, callback);
				}
			], done);
		});

		after(function cleanUp(done) {
			async.series([
				function(callback) {
					review.saveReview(12, 20, callback);
				},
				function(callback) {
					review.unassignReview(12, 20, 1, callback);
				}
			], done);
		});

		it('write a completed review as a committee member', 
			function(done) {
				review.writeReview(19, 17, {
					'fieldNames': [
						'Background', 'researchExp', 'c_Rank'
					],
					'values': ['"Some background"', '"Some research"', 
						'"B+"']}, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('write a valid review as a valid committee member', 
			function(done) {
				review.writeReview(12, 20, {
					'fieldNames': [
						'Background', 'researchExp', 'c_Rank'
					],
					'values': ['"Some background"', '"Some research"', 
						'"B+"']}, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
			});

		it('write a valid review as an invalid committee member', 
			function(done) {
				review.writeReview(17, 1, {
					'fieldNames': [
						'Background', 'researchExp', 'c_Rank'
					],
					'values': ['"Some background"', '"Some research"', 
						'"B+"']},function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('write an invalid review as a valid committee member', 
			function(done) {
				review.writeReview(0, 20, {
					'fieldNames': [
						'Background', 'researchExp', 'c_Rank'
					],
					'values': ['"Some background"', '"Some research"', 
						'"B+"']}, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});

		it('write an invalid review as an invalid committee member', 
			function(done) {
				review.writeReview(0, 1, {
					'fieldNames': [
						'Background', 'researchExp', 'c_Rank'
					],
					'values': ['"Some background"', '"Some research"', 
						'"B+"']}, function(err, result) {
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
				},
				function(callback) {
					review.beginReview(12, 20, callback);
				}
			], done);
		});

		after(function cleanUp(done) {
			async.series([
				function(callback) {
					review.unassignReview(12, 20, 1, callback);
				}
			], done);
		});

		it('save a submitted review as a committee member', 
			function(done) {
				review.saveReview(16, 11, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('save a valid review as a valid committee member', 
			function(done) {
				review.saveReview(12, 20, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
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

	describe('resume a review', function() {
		before(function setUp(done) {
			review.assignReview(12, 20, 1, done);
		});

		after(function cleanUp(done) {
			async.series([
				function(callback) {
					review.saveReview(12, 20, callback);
				},
				function(callback) {
					review.unassignReview(12, 20, 1, callback);
				}
			], done);
		});

		it('resume a submitted review as a committee member', 
			function(done) {
				review.resumeReview(16, 11, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('resume a valid review with valid committee member', 
			function(done) {
				review.resumeReview(12, 20, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
			});

            
		it('resume a valid review with an invalid committee member', 
			function(done) {
				review.resumeReview(17, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('resume an invalid review with valid committee member', 
			function(done) {
				review.resumeReview(0, 20, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});

		it('resume an invalid review with invalid committee member', 
			function(done) {
				review.resumeReview(0, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});
	});

	describe('complete a review', function() {
		before(function setUp(done) {
			async.series([
				function(callback) {
					review.assignReview(12, 20, 1, callback);
				},
				function(callback) {
					review.beginReview(12, 20, callback);
				},
				function(callback) {
					review.writeReview(12, 20, {
						'fieldNames': [
							'Background', 'researchExp', 'c_Rank'
						],
						'values': ['"Some background"', '"Some research"', 
							'"B+"']}, callback);
				},
				function(callback) {
					review.writeReview(20, 16, {
						'fieldNames': [
							'Background', 'researchExp'
						],
						'values': ['"Some background"', '"Some research"']}, 
					callback);
				}
			], done);
		});
        
		it('complete a review not assigned to the committee member', 
			function(done) {
				review.completeReview(16, 12, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('complete a submitted review as a committee member', 
			function(done) {
				review.completeReview(16, 11, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('complete a review without a rank as a committee member', 
			function(done) {
				review.completeReview(20, 16, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('complete a valid review as a valid committee member and valid rank', 
			function(done) {
				review.completeReview(12, 20, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
			});

		it('complete a valid review as a valid committee member but no rank', 
			function(done) {
				review.completeReview(17, 16, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('complete a valid review as an invalid committee member', 
			function(done) {
				review.completeReview(17, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('complete an invalid review as a valid committee member', 
			function(done) {
				review.completeReview(0, 20, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});

		it('complete an invalid review as an invalid committee member', 
			function(done) {
				review.completeReview(0, 1, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should not exist');
					done();
				});
			});
	});

	describe('submit a review', function() {
		it('submit a submitted review as a committee member', 
			function(done) {
				review.submitReview(16, 11, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('submit a valid review with valid committee member', 
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
		describe('getCommitteeRank', function() {
			it('get a committee rank of an application not assigned to a member', 
				function(done) {
					review.getCommitteeRank(16, 12, function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should exist');
						done();
					});
				});
		});
	});
});
