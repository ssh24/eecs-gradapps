'use strict';

var _ = require('lodash');

var async = require('async');

module.exports = function(config, fns) {
	var app = config.app;
	var application = config.application;
	var review = config.review;
	var utils = config.utils;
	var role = config.role;
	var route = config.route = '/roles/admin/reviews';
	var view = 'view-review';
	var max_domestic = 2;
	var max_visa = 1;
	
	var basicReviews = fns.concat([getApps, setLiveSearchData]);
	var postReviews = basicReviews.concat([postReview, getApps, setLiveSearchData]);

	var cmInfo;
	
	require('../view-app')({app: app, application: application, route: route});
    
	// viewing review route - GET
	app.get(route, basicReviews, defaultView);

	// viewing review route - POST
	app.post(route, postReviews, defaultView);

	require('./manage-review')(config, fns);
	
	// default view of the table
	function defaultView(req, res) {
		var userInfo = req.user;
		res.render(view, { 
			title: 'Application Reviews',
			message: req.flash('tableMessage'),
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role,
			apps: req.apps.appls || [],
			fields: req.apps.flds ? (req.apps.flds.fields || []) : [],
			hidden: req.apps.flds ? (req.apps.flds.hidden || []) : [],
			applicants: req.apps.applicants || [],
			gpa: req.apps.gpa || [],
			cms: req.apps.cms || [],
			filter: req.apps.filter || false,
			showfilter: true,
			max_dom: 2,
			max_visa: 1
			// highlightText: {},
			// highlightFunc: highlight,
			// presets: req.presets,
		});
	}

	// get all the reviews, calls `getApplications`
	function getApps(req, res, next) {
		req.apps = {filter: false};
		var sql = 'SELECT app_Id, VStatus as `Visa Status`, FOI as `Field(s) of Interest`, prefProfs as `Preferred Professor(s)`, (CASE WHEN application.VStatus = "Domestic" THEN ((select count(*) from application_review where application_review.appId=application.app_Id)) WHEN application.VStatus = "Visa" THEN ((select count(*) from application_review where application_review.appId=application.app_Id and application_review.Status)) END) as `Reviews Assigned`,(CASE WHEN application.VStatus = "Domestic" THEN ((select count(*) from application_review where application_review.appId=application.app_Id and application_review.Status!="Submitted")) WHEN application.VStatus = "Visa" THEN ((select count(*) from application_review where application_review.appId=application.app_Id and application_review.Status!="Submitted")) END) as `Reviews Pending` FROM APPLICATION where committeeReviewed = 0 order by app_Id;';
		getApplications(sql, {}, req, res, next);
	}

	// calls the actual controller. gets triggered by `getApps`
	function getApplications(sql, options, req, res, next) {
		application.getApplications(sql, req.user.id, function(err, results) {
			if (err) {
				req.flash('tableMessage', 
					'Error loading table. Fatal reason: ' + err.message);
			} else {
				var fields = [];
				var hidden = ['app_Id'];
				var obj = results[0];
			
				for (var key in obj)
					fields.push(key);
			
				if (options) {
					if (options.actionFieldNum) 
						fields.splice(options.actionFieldNum, 0, 'Actions');
					else 
						fields.push('Actions');
				}
			
				req.apps.appls = results;
			
				req.apps.flds = {};
				req.apps.flds.fields = fields;
				req.apps.flds.hidden = hidden;
			}	
			setLiveSearchData(req, res, next);
		});
	}

	// setting live search data such as GPA, CM Names, Fields of Interest(s)
	function setLiveSearchData(req, res, next) {
		req.apps = req.apps || {};
		utils.getApplicantNames(true, function(err, result) {
			if (err) next(err);
			req.apps['applicants'] = result;
			utils.getFieldOfInterests(function(err, result) {
				if (err) next(err);
				req.apps['foi'] = result;
				utils.getAllCommitteeMembers(function(err, result) {
					if (err) next(err);
					var arr = _.filter(result, function(elem) {
						return elem['id'] != req.user.id;
					});
					req.apps['cms'] = _.map(arr, 'name').sort();
					cmInfo = arr;
					utils.getGPA(function(err, result) {
						if (err) next(err);
						req.apps['gpa'] = result;
						next();
					});
				});
			});
		});
	}

	// assigning review application
	function postReview(req, res, next) {
		var body = req.body;
		var assignee = body.cms;
		var appId = parseInt(body.appId);
		var userAssigned, userId;

		if(!assignee) res.redirect(route);
		else if (Array.isArray(assignee)) {
			userId = [];
			async.each(assignee, function(a, cb) {
				userAssigned = _.find(cmInfo, {name: a});
				userId.push(userAssigned['id']);
				cb();	
			}, function() {
				async.each(userId, assignReviews, next);
			});
		} else {
			userId = [];
			userAssigned = _.find(cmInfo, {name: assignee});
			userId.push(userAssigned['id']);
			async.each(userId, assignReviews, next);
		}

		function assignReviews(uId, cb) {
			var allIds;
			if (!appId) {
				allIds = _.map(req.apps.appls, 'app_Id');
			} else {
				allIds = [];
				allIds.push(appId);
			}
			async.each(allIds, function(aId, cb1) {
				async.waterfall([
					function(callback) {
						utils.getVisaStatus(aId, function(err, vstatus) {
							if (err) return callback(err);
							var max;
							if (vstatus === 'Domestic') max = max_domestic;
							if (vstatus === 'Visa') max = max_visa;
							callback(null, max);
						});
					},
					function(arg1, callback) {
						review.getReviewCount(aId, function(err, reviewCount) {
							if (err) return callback(err);
							if((reviewCount + userId.length) <= arg1) {
								callback(null);
							} else {
								cb1();
							}
						});
					},
					function(callback) {
						review.getReviewAssigneeID(aId, function(err, assignees) {
							if (err) return callback(err);
							if (!assignees.includes(uId)) {
								review.assignReview(aId, uId, req.user.id, callback);
							}
							else {
								cb1();
							}
						});	
					}
				], cb1);
			}, cb);
		}
	}
};
