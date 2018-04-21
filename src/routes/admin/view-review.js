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
	var cmInfo, builtSql, builtOptions, builtHighlight;

	var select_assigned = '((select count(*) from application_review where application_review.appId=application.app_Id))';
	var case_dom_assigned = 'WHEN application.VStatus = "Domestic" THEN' + ' ' + select_assigned;
	var case_visa_assigned = 'WHEN application.VStatus = "Visa" THEN' + ' ' + select_assigned;
	var case_assigned = '(CASE ' + case_dom_assigned + ' ' + case_visa_assigned + ' END)';

	var select_pending = '((select count(*) from application_review where application_review.appId=application.app_Id and application_review.Status!="Submitted"))';
	var case_dom_pending = 'WHEN application.VStatus = "Domestic" THEN' + ' ' + select_pending;
	var case_visa_pending = 'WHEN application.VStatus = "Visa" THEN' + ' ' + select_pending;
	var case_pending = '(CASE ' + case_dom_pending + ' ' + case_visa_pending + ' END)';

	var basicReviews = fns.concat([getApps, setLiveSearchData]);
	var postReviews = basicReviews.concat([postReview, getApps, setLiveSearchData]);

	var filterReviewGET, filterReviewPOST;
	filterReviewGET = filterReviewPOST = fns.concat([setLiveSearchData, filterApps]);
	
	
	require('../view-app')({app: app, application: application, route: route});
	require('./manage-review')(config, fns);
    
	// viewing review route - GET
	app.get(route, basicReviews, defaultView);

	// viewing review route - POST
	app.post(route, postReviews, defaultView);
	
	// filter - GET & POST
	app.get(route + '/filter', filterReviewGET, filterView);
	app.post(route + '/filter', filterReviewPOST, filterView);
	
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
			foi: req.apps.foi || [],
			cms: req.apps.cms || [],
			profs: req.apps.profs || [],
			filter: req.apps.filter || false,
			showfilter: true,
			max_dom: max_domestic,
			max_visa: max_visa,
			highlightText: {},
			highlightFunc: highlight,
			url: req.originalUrl
		});
	}

	// default filter view
	function filterView(req, res) {
		var userInfo = req.user;
		res.render(view, {
			title: 'Filtered Reviews',
			message: req.flash('tableMessage'),
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role,
			apps: req.apps.appls || [],
			fields: req.apps.flds ? (req.apps.flds.fields || []) : [],
			hidden: req.apps.flds ? (req.apps.flds.hidden || []) : [],
			foi: req.apps.foi || [],
			cms: req.apps.cms || [],
			profs: req.apps.profs || [],
			filter: req.apps.filter || false,
			showfilter: true,
			max_dom: max_domestic,
			max_visa: max_visa,
			highlightText: req.apps.highlightText,
			highlightFunc: highlight,
			url: req.originalUrl
		});
	}

	// get all the reviews, calls `getApplications`
	function getApps(req, res, next) {
		req.apps = {filter: false};
		var sql = 'SELECT app_Id, VStatus as `Visa Status`, FOI as `Field(s) of ' + 
		'Interest`, prefProfs as `Preferred Professor(s)`,' + case_assigned + 
		' as `Reviews Assigned`,' + case_pending + ' as `Reviews Pending` ' + 
		'FROM APPLICATION where committeeReviewed = 0;';
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
					utils.getAllProfessors(function(err, result) {
						if (err) next(err);
						req.apps['profs'] = result;
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

		if(!assignee) next();
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

	// filter apps middleware
	function filterApps(req, res, next) {
		req.apps = {filter: true};
			
		var cols = req.body.selectedCol;
	
		var sql;
		var sqlCol = '';
		var sqlFilt = '';
	
		var actionFieldNum;
		var highlightText = {};
			
		// default sql
		var defaultSql = 'SELECT app_Id, VStatus as `Visa Status`, FOI as `Field(s) of ' + 
		'Interest`, prefProfs as `Preferred Professor(s)`,' + case_assigned + 
		' as `Reviews Assigned`,' + case_pending + ' as `Reviews Pending`';
			
		/* build columns */
		if (cols) {
			sqlCol = 'SELECT ';
			for (var i = 0; i < cols.length; i++) {
				if (i === 0) sqlCol += 'application.app_Id';
			
				if (cols[i] === 'btn_col_visa') {
					sqlCol += ',application.VStatus as `Visa Status`';
				} else if (cols[i] === 'btn_col_foi') {
					sqlCol += ',application.FOI as `Field(s) of Interest`';
				} else if (cols[i] === 'btn_col_prof') {
					sqlCol += ',application.prefProfs as `Preferred Professor(s)`';
				} else if (cols[i] === 'btn_col_rev_assigned') {
					sqlCol += ',' + case_assigned + ' as `Reviews Assigned`';
				} else if (cols[i] === 'btn_col_rev_pending') {
					sqlCol += ',' + case_pending + ' as `Reviews Pending`';
				} else if (cols[i] === 'btn_col_actions') {
					actionFieldNum = i + 1; // offset of the appId
				}
			}
		}
	
		var fromClause = ' from application';
		sql = (sqlCol ? sqlCol : defaultSql) + fromClause;
			
		/* build where statements */
		if (req.body.btn_filter_visa && req.body.btn_filter_visa !== 'Any' && 
				req.body.btn_filter_visa !== '') {
			sqlFilt += ' and application.VStatus="' + req.body.btn_filter_visa + '"';
			highlightText.visa = req.body.btn_filter_visa;
		}
		if (req.body.btn_filter_foi &&
			req.body.btn_filter_foi !== 'Any' && req.body.btn_filter_foi !== '') {
			sqlFilt += ' and JSON_CONTAINS(foi, \'"' + req.body.btn_filter_foi + '"\')';
			highlightText.foi = req.body.btn_filter_foi;
		}
		if (req.body.btn_filter_prof && req.body.btn_filter_prof !== 'Any' &&
			req.body.btn_filter_prof !== '') {
			sqlFilt += ' and JSON_CONTAINS(prefProfs, \'"' + req.body.btn_filter_prof + '"\')';
			highlightText.prof = req.body.btn_filter_prof;
		}
	
		
		var whereClause = ' where committeeReviewed = 0';
	
		sql = sqlFilt ? sql + whereClause + sqlFilt : sql + whereClause;
	
		var options = {
			actionFieldNum: actionFieldNum
		};
	
		if (!(_.isEmpty(req.body))) {
			builtSql = sql;
			builtOptions = options;
			req.apps.highlightText = highlightText;
			builtHighlight = highlightText;
		} else {
			req.apps.highlightText = builtHighlight;
		}
		if (!builtSql)
			builtSql = defaultSql + fromClause + whereClause;
		getApplications(builtSql, (builtOptions || options), req, res, next);
	}

	// highlighting fields middleware after applying filter
	function highlight(app, field, highlightText) {
		var patternHighlight = null;
		var returnString = app[field];

		if (field === 'Visa Status' && highlightText && highlightText.visa && 
		highlightText.visa !== '') {
			patternHighlight = new RegExp('('+highlightText.visa+')', 'gi');
		} else if (field === 'Field(s) of Interest' && highlightText && highlightText.foi &&
		highlightText.foi !== '') {
			patternHighlight = new RegExp('(' + highlightText.foi + ')', 'gi');
		} else if (field === 'Preferred Professor(s)' && highlightText && highlightText.prof &&
		highlightText.prof !== '') {
			patternHighlight = new RegExp('(' + highlightText.prof + ')', 'gi');
		} else {
			patternHighlight = null;
		}
		if (patternHighlight) {
			if (app[field]) {
				var word = app[field].toString();
				returnString = word.replace(patternHighlight, 
					'<span style="color:red">$1</span>');
			}
		}
		return returnString;
	}
};
