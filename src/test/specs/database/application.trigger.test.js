'use strict';

var assert = require('assert');
var config = require('../../lib/utils/config');
var mysql = require('mysql2');

var Application = require('../../../controller/application');

var application, connection;
var creds = config.credentials.database;

describe('Application Triggers', function() {
	before(function overallSetup(done) {
		connection = mysql.createConnection(creds);
		application = new Application(connection);
		connection.connect(done);
	});
    
	after(function overallCleanUp(done) {
		connection.end(done);
	});

	describe('get all applications', function() {
		it('get all applications available in the portal as a professor', 
			function(done) {
				application.getApplications(null, 20, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
			});

		it('get all applications available in the portal as an admin', 
			function(done) {
				application.getApplications(null, 1, function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
			});

		it('get all applications available in the portal as a committee member', 
			function(done) {
				application.getApplications(null, 10, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});

		it('get all applications available in the portal as a not logged in member', 
			function(done) {
				application.getApplications(null, 11, function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
			});
	});

	describe('update interest status', function() {
		it('set interested status as an admin', function(done) {
			application.updateInterestedStatus(1, 1, 1, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});

		it('set interested status as a committee member', function(done) {
			application.updateInterestedStatus(1, 10, 1, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should not exist');
				done();
			});
		});

		it('set interested status as a professor', function(done) {
			application.updateInterestedStatus(1, 20, 1, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});

		it('unset interested status as an admin', function(done) {
			application.updateInterestedStatus(1, 1, 0, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should exist');
				done();
			});
		});

		it('unset interested status as a committee member', function(done) {
			application.updateInterestedStatus(1, 10, 0, function(err, result) {
				assert(err, 'Error should exist');
				assert(!result, 'Result should exist');
				done();
			});
		});

		it('unset interested status as a professor', function(done) {
			application.updateInterestedStatus(1, 20, 0, function(err, result) {
				if (err) done(err);
				assert(result, 'Result should exist');
				done();
			});
		});
	});

	describe('update contacted status', function() {
		it('set contacted status as an admin', function(done) {
			application.updateContactedStatus(1, 1, 'somename', 1, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
		});

		it('set contacted status as a committee member', function(done) {
			application.updateContactedStatus(1, 10, 'somename', 1, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
		});

		it('set contacted status as a professor', function(done) {
			application.updateContactedStatus(1, 20, 'John Doe', 1, 
				function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
		});

		it('unset contacted status as an admin', function(done) {
			application.updateContactedStatus(1, 1, 'somename', 0, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
		});

		it('unset contacted status as a committee member', function(done) {
			application.updateContactedStatus(1, 10, 'somename', 0, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
		});

		it('unset contacted status as a professor', function(done) {
			application.updateContactedStatus(1, 20, 'John Doe', 0, 
				function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
		});

		it('set contacted status to an already contacted applicant', 
			function(done) {
				application.updateContactedStatus(1, 20, 'John Doe', 1, 
					function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						application.updateContactedStatus(1, 20, 'John Doe', 1, 
							function(err, result) {
								assert(err, 'Error should exist');
								assert(!result, 'Result should exist');
								done();
							});
					});
			});

		it('unset contacted status to an already uncontacted applicant', 
			function(done) {
				application.updateContactedStatus(1, 20, 'John Doe', 0, 
					function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						application.updateContactedStatus(1, 20, 'John Doe', 0, 
							function(err, result) {
								assert(err, 'Error should exist');
								assert(!result, 'Result should exist');
								done();
							});
					});
			});

		it('set contacted status to an invalid application', 
			function(done) {
				application.updateContactedStatus(0, 20, 'John Doe', 1, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should exist');
						done();
					});
			});

		it('unset contacted status to an invalid application', 
			function(done) {
				application.updateContactedStatus(0, 20, 'John Doe', 0, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should exist');
						done();
					});
			});
	});

	describe('update requested status', function() {
		it('set requested status as an admin', function(done) {
			application.updateRequestedStatus(1, 1, 'somename', 1, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
		});

		it('set requested status as a committee member', function(done) {
			application.updateRequestedStatus(1, 10, 'somename', 1, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
		});

		it('set requested status as a professor', function(done) {
			application.updateRequestedStatus(1, 20, 'John Doe', 1, 
				function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
		});

		it('unset requested status as an admin', function(done) {
			application.updateRequestedStatus(1, 1, 'somename', 0, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
		});

		it('unset requested status as a committee member', function(done) {
			application.updateRequestedStatus(1, 10, 'somename', 0, 
				function(err, result) {
					assert(err, 'Error should exist');
					assert(!result, 'Result should exist');
					done();
				});
		});

		it('unset requested status as a professor', function(done) {
			application.updateRequestedStatus(1, 20, 'John Doe', 0, 
				function(err, result) {
					if (err) done(err);
					assert(result, 'Result should exist');
					done();
				});
		});

		it('set requested status to an already requested applicant', 
			function(done) {
				application.updateRequestedStatus(1, 20, 'John Doe', 1, 
					function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						application.updateRequestedStatus(1, 20, 'John Doe', 1, 
							function(err, result) {
								assert(err, 'Error should exist');
								assert(!result, 'Result should exist');
								done();
							});
					});
			});

		it('unset requested status to an already uncontacted applicant', 
			function(done) {
				application.updateRequestedStatus(1, 20, 'John Doe', 0, 
					function(err, result) {
						if (err) done(err);
						assert(result, 'Result should exist');
						application.updateRequestedStatus(1, 20, 'John Doe', 0, 
							function(err, result) {
								assert(err, 'Error should exist');
								assert(!result, 'Result should exist');
								done();
							});
					});
			});

		it('set requested status to an invalid application', 
			function(done) {
				application.updateRequestedStatus(0, 20, 'John Doe', 1, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should exist');
						done();
					});
			});

		it('unset requested status to an invalid application', 
			function(done) {
				application.updateRequestedStatus(0, 20, 'John Doe', 0, 
					function(err, result) {
						assert(err, 'Error should exist');
						assert(!result, 'Result should exist');
						done();
					});
			});
	});
});
