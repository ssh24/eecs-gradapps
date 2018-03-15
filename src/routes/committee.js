'use strict';

var _ = require('lodash');

module.exports = function(app, utils, application, fns) {
	var basicCommittee = fns.concat([getApps]);
	var filterCommittee = fns.concat([filterApps]);
	var filterPost = fns.concat([filterApps]);
	var builtSql, builtOptions, builtHighlight;

	// committee page route
	app.get('/roles/committee', basicCommittee, function(req, res) {
		var userInfo = req.user;
		var role = 'Committee Member';
		res.render('committee', {
			title: 'Review Applications',
			message: req.flash('tableMessage'),
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role,
			apps: req.apps.appls || [],
			fields: req.apps.flds ? (req.apps.flds.fields || []) : [],
			hidden: req.apps.flds ? (req.apps.flds.hidden || []) : [],
			applicants: req.apps.applicants || [],
			filter: req.apps.filter || false,
			highlightText: {},
			highlightFunc: highlight
		});
	});

	app.get('/roles/committee/filter', filterCommittee, function(req, res) {
		var userInfo = req.user;
		var role = 'Committee Member';
		res.render('committee', {
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
			filter: req.apps.filter || false,
			highlightText: req.apps.highlightText,
			highlightFunc: highlight
		});
	});

	app.post('/roles/committee/filter', filterPost, function(req, res) {
		var userInfo = req.user;
		var role = 'Committee Member';
		res.render('committee', {
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
			filter: req.apps.filter || false,
			highlightText: req.apps.highlightText,
			highlightFunc: highlight
		});
	});

	function filterApps(req, res, next) {
		req.apps = {filter: true};
		
		var cols = req.body.selectedCol;

		var sql;
		var sqlCol = '';
		var sqlFilt = '';

		var reviewField;
		var actionFieldNum;
		var highlightText = {};
		
		// default sql
		var defaultSql = 'select application.app_Id, DATE_FORMAT(application.app_Date, "%d/%m/%Y") as `Date Uploaded`, ' + 
		'CONCAT_WS(\' \', application.FName, application.LName) AS `Applicant Name`, application.Degree as `Degree Applied For`, ' + 
		'application_review.Status as `My Review Status`';
		
		/* build columns */
		if (cols) {
			sqlCol = 'SELECT ';
			for (var i = 0; i < cols.length; i++) {
				if (i === 0) sqlCol += 'application.app_Id';
		
				if (cols[i] === 'btn_col_date') {
					sqlCol += ',DATE_FORMAT(application.app_Date, "%d/%m/%Y") as `Date Uploaded`';
				} else if (cols[i] === 'btn_col_name') {
					sqlCol += ',CONCAT_WS(\' \', application.FName, application.LName) AS `Applicant Name`';
				} else if (cols[i] === 'btn_col_degree') {
					sqlCol += ',application.Degree as `Degree Applied For`';
				} else if (cols[i] === 'btn_col_review') {
					reviewField = true;
				} else if (cols[i] === 'btn_col_actions') {
					actionFieldNum = i + 1; // offset of the appId
				}
			}
		} else {
			reviewField = true;
		}

		sqlCol = sqlCol ? sqlCol + ',application_review.Status as `My Review Status`': null;

		var fromClause = ' from application inner join application_review';
		sql = (sqlCol ? sqlCol : defaultSql) + fromClause;
		
		/* build where statements */
		if (req.body.btn_filter_name && req.body.btn_filter_name !== 'Any' && 
				req.body.btn_filter_name !== '') {
			sqlFilt += ' and CONCAT_WS(\'\', application.FName, application.LName)=' + 
				req.body.btn_filter_name;
			highlightText.name = req.body.btn_filter_name;
		}
		if (req.body.btn_filter_degree && req.body.btn_filter_degree !== 'Any' && 
				req.body.btn_filter_degree !== '') {
			sqlFilt += ' and application.Degree="' + req.body.btn_filter_degree + '"';
			highlightText.degree = req.body.btn_filter_degree;
		}
		if (req.body.btn_filter_review && req.body.btn_filter_review !== 'Any' && 
				req.body.btn_filter_review !== '') {
			sqlFilt += ' and application_review.Status="' + req.body.btn_filter_review + '"';
			highlightText.review = req.body.btn_filter_review;
		}

		var whereClause = ' where application.app_Id = application_review.appId and application_review.committeeId=' 
		+ req.user.id;

		sql += sqlFilt ? whereClause + sqlFilt : whereClause;

		var options = {
			actionFieldNum: actionFieldNum,
			reviewField: reviewField,
		};

		if (!(_.isEmpty(req.body))) {
			builtSql = sql;
			builtOptions = options;
			req.apps.highlightText = highlightText;
			builtHighlight = highlightText;
		} else {
			req.apps.highlightText = builtHighlight;
		}

		getApplications(builtSql, (builtOptions || options), req, res, next);
	}

	function getApps(req, res, next) {
		req.apps = {};
		builtSql = builtOptions = null;
		getApplications(null, {reviewField: true}, req, res, next);
	}

	function getApplications(sql, options, req, res, next) {
		application.getReviewApplications(sql, req.user.id, function(err, results) {
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

					if (!options.reviewField)
						hidden.push('My Review Status');
				}
			
				req.apps.appls = results;
			
				req.apps.flds = {};
				req.apps.flds.fields = fields;
				req.apps.flds.hidden = hidden;
			}
			setLiveSearchData(req, res, next);	
		});
	}

	function setLiveSearchData(req, res, next) {
		utils.getApplicantNames(function(err, result) {
			if (err) next(err);
			req.apps['applicants'] = result;
			next();
		});
	}

	function highlight(app, field, highlightText) {
		var patternHighlight = null;
		var returnString = app[field];
	
		if (field === 'Applicant Name' && highlightText.name && 
		highlightText.name !== '') {
			patternHighlight = new RegExp('('+highlightText.name+')', 'gi');
		} else if (field === 'Degree Applied For' && highlightText.degree && 
		highlightText.degree !== '') {
			patternHighlight = new RegExp('('+highlightText.degree+')', 'gi');
		} else if (field === 'My Review Status' && highlightText.review && 
		highlightText.review !== '') {
			patternHighlight = new RegExp('('+highlightText.review+')', 'gi');
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
