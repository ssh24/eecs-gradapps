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

	var filterReviewGET = fns.concat([setLiveSearchData, filterApps]);
	var filterReviewPOST = fns.concat([setLiveSearchData, filterApps]);

	var cmInfo, builtSql, builtOptions, builtHighlight;

	var select_assigned = '((select count(*) from application_review where application_review.appId=application.app_Id))';
	var case_dom_assigned = 'WHEN application.VStatus = "Domestic" THEN' + ' ' + select_assigned;
	var case_visa_assigned = 'WHEN application.VStatus = "Visa" THEN' + ' ' + select_assigned;
	var case_assigned = '(CASE ' + case_dom_assigned + ' ' + case_visa_assigned + ' END)';

	var select_pending = '((select count(*) from application_review where application_review.appId=application.app_Id and application_review.Status!="Submitted"))';
	var case_dom_pending = 'WHEN application.VStatus = "Domestic" THEN' + ' ' + select_pending;
	var case_visa_pending = 'WHEN application.VStatus = "Visa" THEN' + ' ' + select_pending;
	var case_pending = '(CASE ' + case_dom_pending + ' ' + case_visa_pending + ' END)';
	
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
			max_dom: 2,
			max_visa: 1,
			// highlightText: {},
			// highlightFunc: highlight,
			presets: req.presets,
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
			profs: req.apps.profs || [],
			filter: req.apps.filter || false,
			showfilter: true,
			// highlightText: req.apps.highlightText,
			// highlightFunc: highlight,
			presets: req.presets
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
					sqlCol += case_assigned + ' as `Reviews Assigned`';
				} else if (cols[i] === 'btn_col_rev_pending') {
					sqlCol += case_pending + ' as `Reviews Pending`';
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
			if (sqlFilt != '') sqlFilt += ' and ';
			sqlFilt += 'application.VStatus="' + req.body.btn_filter_visa + '"';
			// highlightText.visa = req.body.btn_filter_visa;
		}
		if (req.body.btn_filter_foi &&
			req.body.btn_filter_foi !== 'Any' && req.body.btn_filter_foi !== '') {
				  sqlFilt += ' and JSON_CONTAINS(foi, \'"' +
			  req.body.btn_filter_foi + '"\')';
				  // highlightText.foi = req.body.btn_filter_foi;
		}
		if (req.body.btn_filter_prof && req.body.btn_filter_prof !== 'Any' &&
			req.body.btn_filter_prof !== '') {
			  sqlFilt += ' and JSON_CONTAINS(prefProfs, \'"' +
		  req.body.btn_filter_prof + '"\')';
			  // highlightText.prof = req.body.btn_filter_prof;
		  }
	
		
		var whereClause = ' where committeeReviewed = 0 ';
	
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
			builtSql = defaultSql + fromClause;
		getApplications(builtSql, (builtOptions || options), req, res, next);
	}

	// middleware that will help load a users preset to the filter form.
	// function getPresets(req, res, next) {
	// 	fm.getPresets(req.user.id, role, function(err, results) {
	// 		if (err) {
	// 			next(err);
	// 		} else {
	// 			req.presets = results[0]['presetAdmin'];
	// 			next();
	// 		}
	// 	});
	// }

	// middleware that will help update/set a users preset from the filter form
	// function setPreset(req, res, next) {
	// 	var presetName = req.body.preset_name;
	// 	if (presetName) {
	// 		var activeCols = req.body.selectedCol;
	// 		var cols;
	// 		if (activeCols) {
	// 			cols = activeCols.slice(); //  copy the active cols.
	// 		} else {
	// 			cols = [];
	// 		}
	// 		var filters = [];
	// 		var colValues = [];
	// 		var filterValues = [];
	// 		for (var i = 0; i < cols.length; i++) {
	// 			colValues.push(i + 1);
	// 		}
			
	// 		//add the nonactive ones to the end. with empty values
	// 		if (!cols.includes('btn_col_date')) {
	// 			cols.push('btn_col_date');
	// 			colValues.push('');
	// 		}
	// 		if (!cols.includes('btn_col_name')) {
	// 			cols.push('btn_col_name');
	// 			colValues.push('');
	// 		}
	// 		if (!cols.includes('btn_col_sid')) {
	// 			cols.push('btn_col_sid');
	// 			colValues.push('');
	// 		}
	// 		if (!cols.includes('btn_col_degree')) {
	// 			cols.push('btn_col_degree');
	// 			colValues.push('');
	// 		}
	// 		if (!cols.includes('btn_col_gpa')) {
	// 			cols.push('btn_col_gpa');
	// 			colValues.push('');
	// 		}
	// 		if (!cols.includes('btn_col_visa')) {
	// 			cols.push('btn_col_visa');
	// 			colValues.push('');
	// 		}
	// 		if (!cols.includes('btn_col_program_decision')) {
	// 			cols.push('btn_col_program_decision');
	// 			colValues.push('');
	// 		}
	// 		if (!cols.includes('btn_col_actions')) {
	// 			cols.push('btn_col_actions');
	// 			colValues.push('');
	// 		}
		
	// 		//add filters to array and their values
	// 		filters.push('btn_filter_name');
	// 		if (req.body.btn_filter_name && req.body.btn_filter_name !== 'Any' &&
	// 				req.body.btn_filter_name !== '') {
	// 			filterValues.push(req.body.btn_filter_name);
	// 		} else {
	// 			filterValues.push('');
	// 		}
	// 		filters.push('btn_filter_degree');
	// 		if (req.body.btn_filter_degree && req.body.btn_filter_degree !== 'Any' &&
	// 				req.body.btn_filter_degree !== '') {
	// 			filterValues.push(req.body.btn_filter_degree);
	// 		} else {
	// 			filterValues.push('');
	// 		}
	// 		filters.push('btn_filter_gpa');
	// 		if (req.body.btn_filter_gpa && req.body.btn_filter_gpa !== 'Any' &&
	// 				req.body.btn_filter_gpa !== '') {
	// 			filterValues.push(req.body.btn_filter_gpa);
	// 		} else {
	// 			filterValues.push('');
	// 		}
	// 		filters.push('btn_filter_visa');
	// 		if (req.body.btn_filter_visa && req.body.btn_filter_visa !== 'Any' &&
	// 				req.body.btn_filter_visa !== '') {
	// 			filterValues.push(req.body.btn_filter_visa);
	// 		} else {
	// 			filterValues.push('');
	// 		}
	// 		filters.push('btn_filter_program_decision');
	// 		if (req.body.btn_filter_program_decision && req.body.btn_filter_program_decision 
	// 			!== 'Any' && req.body.btn_filter_program_decision !== '') {
	// 			filterValues.push(req.body.btn_filter_program_decision);
	// 		} else {
	// 			filterValues.push('');
	// 		}
		
	// 		var options = {
	// 			column_name: cols,
	// 			column_val: colValues,
	// 			filter_name: filters,
	// 			filter_val: filterValues
	// 		};
	// 		fm.updatePreset(req.user.id, role, presetName, options, next);
	// 	} else {
	// 		next();
	// 	}
	// }

	// highlighting fields middleware after applying filter
	// function highlight(app, field, highlightText) {
	// 	var patternHighlight = null;
	// 	var returnString = app[field];

	// 	//patterns for committee rank and gpa ranking matching
	// 	var patt_Aplus = /\w*(A\+)\w*/gi;
	// 	var patt_A = /\w*(A\+|A)\w*/gi;
	// 	var patt_Bplus = /\w*(A\+|A|B\+)\w*/gi;
	// 	var patt_B = /\w*(A\+|A|B\+|B)\w*/gi;
	// 	var patt_Cplus = /\w*(A\+|A|B\+|B|C\+)\w*/gi;
	// 	var patt_C = /\w*(A\+|A|B\+|B|C\+|C)\w*/gi;
	// 	var patt_Dplus = /\w*(A\+|A|B\+|B|C\+|C|D\+)\w*/gi;
	// 	var patt_D = /\w*(A\+|A|B\+|B|C\+|C|D\+|D)\w*/gi;
	// 	var patt_E = /\w*(A\+|A|B\+|B|C\+|C|D\+|D|E)\w*/gi;
	// 	var patt_F = /\w*(A\+|A|B\+|B|C\+|C|D\+|D|E|F)\w*/gi;
	
	// 	if (field === 'Applicant Name' && highlightText && highlightText.name && 
	// 	highlightText.name !== '') {
	// 		patternHighlight = new RegExp('('+highlightText.name+')', 'gi');
	// 	} else if (field === 'Degree Applied For' && highlightText && highlightText.degree && 
	// 	highlightText.degree !== '') {
	// 		patternHighlight = new RegExp('('+highlightText.degree+')', 'gi');
	// 	} else if (field === 'Visa Status' && highlightText && highlightText.visa && 
	// 	highlightText.visa !== '') {
	// 		patternHighlight = new RegExp('('+highlightText.visa+')', 'gi');
	// 	} else if (field === 'Program Decision' && highlightText && highlightText.program_decision && 
	// 	highlightText.program_decision !== '') {
	// 		patternHighlight = new RegExp('('+highlightText.program_decision+')', 'gi');
	// 	} else if (field === 'GPA' && highlightText && highlightText.gpa && highlightText.gpa !== '') {
	// 		if (patt_Aplus.test(highlightText.gpa)) {
	// 			patternHighlight = patt_Aplus;
	// 		} else if (patt_A.test(highlightText.gpa)) {
	// 			patternHighlight = patt_A;
	// 		} else if (patt_Bplus.test(highlightText.gpa)) {
	// 			patternHighlight = patt_Bplus;
	// 		} else if (patt_B.test(highlightText.gpa)) {
	// 			patternHighlight = patt_B;
	// 		} else if (patt_Cplus.test(highlightText.gpa)) {
	// 			patternHighlight = patt_Cplus;
	// 		} else if (patt_C.test(highlightText.gpa)) {
	// 			patternHighlight = patt_C;
	// 		} else if (patt_Dplus.test(highlightText.gpa)) {
	// 			patternHighlight = patt_Dplus;
	// 		} else if (patt_D.test(highlightText.gpa)) {
	// 			patternHighlight = patt_D;
	// 		} else if (patt_E.test(highlightText.gpa)) {
	// 			patternHighlight = patt_E;
	// 		} else if (patt_F.test(highlightText.gpa)) {
	// 			patternHighlight = patt_F;
	// 		} else {
	// 			patternHighlight = null;
	// 		}
	// 	} else {
	// 		patternHighlight = null;
	// 	}
	// 	if (patternHighlight) {
	// 		if (app[field]) {
	// 			var word = app[field].toString();
	// 			returnString = word.replace(patternHighlight, 
	// 				'<span style="color:red">$1</span>');
	// 		}
	// 	}
	// 	return returnString;
	// }
};
