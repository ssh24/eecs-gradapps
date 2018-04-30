'use strict';

var _ = require('lodash');

module.exports = function(config, fns) {
	var app = config.app;
	var application = config.application;
	var fm = config.fm;
	var utils = config.utils;
	var role = config.role;
	var route = config.route = '/roles/admin/applications';
	var view = 'manage-app';
	
	var basicAdmin = fns.concat([getApps, setLiveSearchData, getPresets]);
	var filterAdminAppsGET = fns.concat([filterApps, getPresets, setPreset]);
	var filterAdminAppsPOST = fns.concat([filterApps, getPresets, setPreset, 
		getPresets]);

	var builtSql, builtOptions, builtHighlight;

	require('./manage-app/new-app')(config, basicAdmin);
	require('./manage-app/edit-app')(config, basicAdmin);
	require('../view-app')(config);
    
	// managing application route
	app.get(route, basicAdmin, defaultView);

	// filter - GET & POST
	app.get(route + '/filter', filterAdminAppsGET, filterView);
	app.post(route + '/filter', filterAdminAppsPOST, filterView);
	
	// default view of the table
	function defaultView(req, res) {
		var userInfo = req.user;
		res.render(view, { 
			title: 'Applications',
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
			filter: req.apps.filter || false,
			showfilter: true,
			highlightText: {},
			highlightFunc: highlight,
			presets: req.presets,
		});
	}

	// get all the applications, calls `getApplications`
	function getApps(req, res, next) {
		req.apps = {filter: false};
		var sql = 'SELECT app_Id, DATE_FORMAT(app_Date, "%m/%d/%Y") as `Date Uploaded`, student_Id as `Student Number`, CONCAT_WS(\' \', `FName`, `LName`) AS `Applicant Name`, ' +
		'GPA, Degree as `Degree Applied For`, ' +
		'VStatus as `Visa Status`, programDecision as `Program Decision` ' +
		'FROM application order by app_Date';
		getApplications(sql, {}, req, res, next);
	}

	// calls the actual controller. gets triggered by `getApps`
	function getApplications(sql, options, req, res, next) {
		application.getApplications(sql, req.user.id, function(err, results) {
			if (err) {
				req.flash('tableMessage', 
					'Error loading table. Reason: ' + err.message);
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

	// setting live search data such as GPA, Professor Names, Fields of Interest(s)
	function setLiveSearchData(req, res, next) {
		req.apps = req.apps || {};
		utils.getApplicantNames(true, function(err, result) {
			if (err) next(err);
			req.apps['applicants'] = result;
			utils.getFieldOfInterests(function(err, result) {
				if (err) next(err);
				req.apps['foi'] = result;
				utils.getAllProfessors(function(err, result) {
					if (err) next(err);
					req.apps['profs'] = result;
					utils.getGPA(function(err, result) {
						if (err) next(err);
						req.apps['gpa'] = result;
						next();
					});
				});
			});
		});
	}

	// default filter view
	function filterView(req, res) {
		var userInfo = req.user;
		res.render(view, {
			title: 'Filtered Applications',
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
			filter: req.apps.filter || false,
			showfilter: true,
			highlightText: req.apps.highlightText,
			highlightFunc: highlight,
			presets: req.presets
		});
	}

	// middleware that will help load a users preset to the filter form.
	function getPresets(req, res, next) {
		fm.getPresets(req.user.id, role, function(err, results) {
			if (err) {
				next(err);
			} else {
				req.presets = results[0]['presetAdmin'];
				next();
			}
		});
	}

	// middleware that will help update/set a users preset from the filter form
	function setPreset(req, res, next) {
		var presetName = req.body.preset_name;
		if (presetName) {
			var activeCols = req.body.selectedCol;
			var cols;
			if (activeCols) {
				cols = activeCols.slice(); //  copy the active cols.
			} else {
				cols = [];
			}
			var filters = [];
			var colValues = [];
			var filterValues = [];
			for (var i = 0; i < cols.length; i++) {
				colValues.push(i + 1);
			}
			
			//add the nonactive ones to the end. with empty values
			if (!cols.includes('btn_col_date')) {
				cols.push('btn_col_date');
				colValues.push('');
			}
			if (!cols.includes('btn_col_name')) {
				cols.push('btn_col_name');
				colValues.push('');
			}
			if (!cols.includes('btn_col_sid')) {
				cols.push('btn_col_sid');
				colValues.push('');
			}
			if (!cols.includes('btn_col_degree')) {
				cols.push('btn_col_degree');
				colValues.push('');
			}
			if (!cols.includes('btn_col_gpa')) {
				cols.push('btn_col_gpa');
				colValues.push('');
			}
			if (!cols.includes('btn_col_visa')) {
				cols.push('btn_col_visa');
				colValues.push('');
			}
			if (!cols.includes('btn_col_program_decision')) {
				cols.push('btn_col_program_decision');
				colValues.push('');
			}
			if (!cols.includes('btn_col_actions')) {
				cols.push('btn_col_actions');
				colValues.push('');
			}
		
			//add filters to array and their values
			filters.push('btn_filter_name');
			if (req.body.btn_filter_name && req.body.btn_filter_name !== 'Any' &&
					req.body.btn_filter_name !== '') {
				filterValues.push(req.body.btn_filter_name);
			} else {
				filterValues.push('');
			}
			filters.push('btn_filter_degree');
			if (req.body.btn_filter_degree && req.body.btn_filter_degree !== 'Any' &&
					req.body.btn_filter_degree !== '') {
				filterValues.push(req.body.btn_filter_degree);
			} else {
				filterValues.push('');
			}
			filters.push('btn_filter_gpa');
			if (req.body.btn_filter_gpa && req.body.btn_filter_gpa !== 'Any' &&
					req.body.btn_filter_gpa !== '') {
				filterValues.push(req.body.btn_filter_gpa);
			} else {
				filterValues.push('');
			}
			filters.push('btn_filter_visa');
			if (req.body.btn_filter_visa && req.body.btn_filter_visa !== 'Any' &&
					req.body.btn_filter_visa !== '') {
				filterValues.push(req.body.btn_filter_visa);
			} else {
				filterValues.push('');
			}
			filters.push('btn_filter_program_decision');
			if (req.body.btn_filter_program_decision && req.body.btn_filter_program_decision 
				!== 'Any' && req.body.btn_filter_program_decision !== '') {
				filterValues.push(req.body.btn_filter_program_decision);
			} else {
				filterValues.push('');
			}
		
			var options = {
				column_name: cols,
				column_val: colValues,
				filter_name: filters,
				filter_val: filterValues
			};
			fm.updatePreset(req.user.id, role, presetName, options, next);
		} else {
			next();
		}
	}

	// filter apps middleware
	function filterApps(req, res, next) {
		req.apps = {filter: true};
		
		var cols = req.body.selectedCol;

		var sql;
		var sqlCol = '';
		var sqlFilt = '';
		var gpaFilt = false;

		var actionFieldNum;
		var highlightText = {};
		
		// default sql
		var defaultSql = 'select application.app_Id, application.student_Id as `Student Number`, DATE_FORMAT(application.app_Date, "%m/%d/%Y") as `Date Uploaded`, ' + 
		'CONCAT_WS(\' \', application.FName, application.LName) AS `Applicant Name`, application.GPA, application.Degree as `Degree Applied For`, ' + 
		'application.VStatus as `Visa Status`, application.programDecision as `Program Decision`';
		var gpaSql = ' INNER JOIN gpa on application.GPA = gpa.letter_grade';
		
		/* build columns */
		if (cols) {
			sqlCol = 'SELECT ';
			for (var i = 0; i < cols.length; i++) {
				if (i === 0) sqlCol += 'application.app_Id';
		
				if (cols[i] === 'btn_col_date') {
					sqlCol += ',DATE_FORMAT(application.app_Date, "%m/%d/%Y") as `Date Uploaded`';
				} else if (cols[i] === 'btn_col_name') {
					sqlCol += ',CONCAT_WS(\' \', application.FName, application.LName) AS `Applicant Name`';
				} else if (cols[i] === 'btn_col_degree') {
					sqlCol += ',application.Degree as `Degree Applied For`';
				} else if (cols[i] === 'btn_col_gpa') {
					sqlCol += ',application.GPA';
				} else if (cols[i] === 'btn_col_sid') {
					sqlCol += ',application.student_Id as `Student Number`';
				} else if (cols[i] === 'btn_col_visa') {
					sqlCol += ',application.VStatus as `Visa Status`';
				} else if (cols[i] === 'btn_col_program_decision') {
					sqlCol += ',application.programDecision as `Program Decision`';
				} else if (cols[i] === 'btn_col_actions') {
					actionFieldNum = i + 1; // offset of the appId
				}
			}
		}

		var fromClause = ' from application';
		sql = (sqlCol ? sqlCol : defaultSql) + fromClause;
		
		/* build where statements */
		if (req.body.btn_filter_name && req.body.btn_filter_name !== 'Any' && 
				req.body.btn_filter_name !== '') {
			//need to put space in the first parameter of concat or it won't work. Please don't remove the space.
			if (sqlFilt != '') sqlFilt += ' and ';
			sqlFilt += 'CONCAT_WS(\' \', `FName`, `LName`)="' +
				req.body.btn_filter_name + '"';
			highlightText.name = req.body.btn_filter_name;
		}
		if (req.body.btn_filter_degree && req.body.btn_filter_degree !== 'Any' && 
				req.body.btn_filter_degree !== '') {
			if (sqlFilt != '') sqlFilt += ' and ';
			sqlFilt += 'application.Degree="' + req.body.btn_filter_degree + '"';
			highlightText.degree = req.body.btn_filter_degree;
		}
		if (req.body.btn_filter_gpa && req.body.btn_filter_gpa !== 'Any' && 
				req.body.btn_filter_gpa !== '') {
			if (sqlFilt != '') sqlFilt += ' and ';
			gpaFilt = true;
			sqlFilt += 'gpa.grade_point' + req.body.btn_filter_gpa.split(' ')[0] +
			'(select grade_point ' + 'from gpa where letter_grade = "' +
			req.body.btn_filter_gpa.split(' ')[1] + '")';
			highlightText.gpa = req.body.btn_filter_gpa;
		}
		if (req.body.btn_filter_visa && req.body.btn_filter_visa !== 'Any' && 
			req.body.btn_filter_visa !== '') {
			if (sqlFilt != '') sqlFilt += ' and ';
			sqlFilt += 'application.VStatus="' + req.body.btn_filter_visa + '"';
			highlightText.visa = req.body.btn_filter_visa;
		}
		if (req.body.btn_filter_program_decision && req.body.btn_filter_program_decision !== 'Any' && 
			req.body.btn_filter_program_decision !== '') {
			if (sqlFilt != '') sqlFilt += ' and ';
			sqlFilt += 'application.programDecision="' + req.body.btn_filter_program_decision + '"';
			highlightText.program_decision = req.body.btn_filter_program_decision;
		}

		var joinSql = gpaFilt ? gpaSql : '';
		var whereClause = ' where ';

		sql += joinSql;
		sql = sqlFilt ? sql + whereClause + sqlFilt : sql;

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

	// highlighting fields middleware after applying filter
	function highlight(app, field, highlightText) {
		var patternHighlight = null;
		var returnString = app[field];

		//patterns for committee rank and gpa ranking matching
		var patt_Aplus = /\w*(A\+)\w*/gi;
		var patt_A = /\w*(A\+|A)\w*/gi;
		var patt_Bplus = /\w*(A\+|A|B\+)\w*/gi;
		var patt_B = /\w*(A\+|A|B\+|B)\w*/gi;
		var patt_Cplus = /\w*(A\+|A|B\+|B|C\+)\w*/gi;
		var patt_C = /\w*(A\+|A|B\+|B|C\+|C)\w*/gi;
		var patt_Dplus = /\w*(A\+|A|B\+|B|C\+|C|D\+)\w*/gi;
		var patt_D = /\w*(A\+|A|B\+|B|C\+|C|D\+|D)\w*/gi;
		var patt_E = /\w*(A\+|A|B\+|B|C\+|C|D\+|D|E)\w*/gi;
		var patt_F = /\w*(A\+|A|B\+|B|C\+|C|D\+|D|E|F)\w*/gi;
	
		if (field === 'Applicant Name' && highlightText && highlightText.name && 
		highlightText.name !== '') {
			patternHighlight = new RegExp('('+highlightText.name+')', 'gi');
		} else if (field === 'Degree Applied For' && highlightText && highlightText.degree && 
		highlightText.degree !== '') {
			patternHighlight = new RegExp('('+highlightText.degree+')', 'gi');
		} else if (field === 'Visa Status' && highlightText && highlightText.visa && 
		highlightText.visa !== '') {
			patternHighlight = new RegExp('('+highlightText.visa+')', 'gi');
		} else if (field === 'Program Decision' && highlightText && highlightText.program_decision && 
		highlightText.program_decision !== '') {
			patternHighlight = new RegExp('('+highlightText.program_decision+')', 'gi');
		} else if (field === 'GPA' && highlightText && highlightText.gpa && highlightText.gpa !== '') {
			if (patt_Aplus.test(highlightText.gpa)) {
				patternHighlight = patt_Aplus;
			} else if (patt_A.test(highlightText.gpa)) {
				patternHighlight = patt_A;
			} else if (patt_Bplus.test(highlightText.gpa)) {
				patternHighlight = patt_Bplus;
			} else if (patt_B.test(highlightText.gpa)) {
				patternHighlight = patt_B;
			} else if (patt_Cplus.test(highlightText.gpa)) {
				patternHighlight = patt_Cplus;
			} else if (patt_C.test(highlightText.gpa)) {
				patternHighlight = patt_C;
			} else if (patt_Dplus.test(highlightText.gpa)) {
				patternHighlight = patt_Dplus;
			} else if (patt_D.test(highlightText.gpa)) {
				patternHighlight = patt_D;
			} else if (patt_E.test(highlightText.gpa)) {
				patternHighlight = patt_E;
			} else if (patt_F.test(highlightText.gpa)) {
				patternHighlight = patt_F;
			} else {
				patternHighlight = null;
			}
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
