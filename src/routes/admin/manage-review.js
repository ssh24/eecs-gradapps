'use strict';

var _ = require('lodash');

var async = require('async');

module.exports = function(config, fns) {
	var app = config.app;
	var application = config.application;
	var review = config.review;
	var utils = config.utils;
	var role = config.role;
	var default_route = config.route;
	var route = config.route + '/manage';
	var view = 'manage-review';

	var appId;

	var getEditReviews = fns.concat([getReviewData]);
	var postEditReviews = fns.concat([saveReviewData]);

	// managing review route - GET
	app.get(route, getEditReviews, defaultView);

	// managing review route - GET
	app.post(route, postEditReviews, function(req, res) {
		res.redirect('/roles/admin/reviews/manage?appId=' + appId);
	});

	function defaultView(req, res)  {
		var userInfo = req.user;
		res.render(view, { 
			title: 'Manage Review',
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role,
			appId: appId,
			sid: req.apps.review.sid,
			lname: req.apps.review.lname,
			fname: req.apps.review.fname,
			visa: req.apps.review.visa,
			foi: req.apps.review.foi || [],
			prefProfs: req.apps.review.prefProfs || [],
			assignees: req.apps.review.assignees || [],
			showfilter: false,
		});
	}

	function getReviewData(req, res, next) {
		req.apps = req.apps || {};
		appId = parseInt(req.query.appId);
		if (!appId)
			res.redirect(default_route);
		else {
			application.getApplicationData(appId, req.user.id, function(err, result) {
				if (err) {
					res.redirect(default_route);
				}
				req.apps.review = {};
				
				req.apps.review.sid = result['student_Id'];
				req.apps.review.lname = result['LName'];
				req.apps.review.fname = result['FName'];
				req.apps.review.visa = result['VStatus'];

				req.apps.review.foi = result['FOI'] && Array.isArray(result['FOI']) ? result['FOI'] : [result['FOI']];
				req.apps.review.prefProfs = result['prefProfs'] && Array.isArray(result['prefProfs']) ? result['prefProfs'] : [result['prefProfs']];

				req.apps.review.assignees = [];

				review.getReviewAssigneeID(appId, function(err, ids) {
					if (err) res.redirect(default_route);
					ids = _.map(ids, 'committeeId');

					async.each(ids, getMemberName, next);
				});
			});
		}
		function getMemberName(id, cb) {
			utils.getMemberFullName(id, function(err, res1) {
				if (err) return cb(err);
				utils.getMemberEmail(id, function(err, res2) {
					if (err) return cb(err);
					review.getReviewStatus(appId, id, function(err, res3) {
						if (err) return cb(err);
						review.getReviewAssignedDate(appId, id, function(err, res4) {
							if (err) return cb(err);
							req.apps.review.assignees.push({id: id, a_date: res4, name: res1, 
								email: res2, status: res3});
							return cb();
						});
					});
				});
			});
		}
	}

	function saveReviewData(req, res, next) {
		var body = req.body;
		var committeeId;
		
		if (body && body['unassign']) {	
			committeeId = parseInt(body['unassign']);
			review.unassignReview(appId, committeeId, req.user.id, next);
		} else if (body && body['dismiss']) {
			committeeId = parseInt(body['dismiss']);
			review.dismissReview(appId, committeeId, req.user.id, next);
		}
	}
};
