'use strict';

var _ = require('lodash');
var mysql = require('mysql2');

var creds = require('../config/database');
var connection = mysql.createConnection(creds);
connection.connect();

var Review = require('../controller/review');
var review = new Review(connection);

module.exports = function(app, utils, application, faculty_member, fns) {
	var basicCommittee = fns.concat([getApps, getPresets]);

	var filterCommittee = fns.concat([filterApps, getPresets]);
	var filterPost = fns.concat([filterApps, getPresets]);

	var presetCommittee = fns.concat([filterApps, getPresets]);
	var presetPost = fns.concat([filterApps, setPreset, getPresets]);

	var getReview = fns.concat([setUpReview, getReviews]);
	var saveReviews = fns.concat([saveReview, getApps]);

	var builtSql, builtOptions, builtHighlight;
	var prevAppId, prevStatus;

	var role = 'Committee Member';
	var route = 'committee';

	require('./view-app')({app: app, application: application, route: 
		'/roles/' + route});
	require('./view-app')({app: app, application: application, route: 
			'/roles/' + route + '/review'});

	// committee page route
	app.get('/roles/' + route, basicCommittee, function(req, res) {
		var userInfo = req.user;
		res.render(route, {
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
			showfilter: true,
			highlightText: {},
			highlightFunc: highlight,
			presets: req.presets
		});
	});

	app.post('/roles/' + route, saveReviews, function(req, res) {
		var userInfo = req.user;
		res.render(route, {
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
			showfilter: true,
			highlightText: {},
			highlightFunc: highlight,
			presets: req.presets
		});
	});

	app.get('/roles/' + route + '/filter', filterCommittee, function(req, res) {
		var userInfo = req.user;
		res.render(route, {
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
			showfilter: true,
			highlightText: req.apps.highlightText,
			highlightFunc: highlight,
			presets: req.presets
		});
	});

	app.post('/roles/' + route + '/filter', filterPost, function(req, res) {
		var userInfo = req.user;
		res.render(route, {
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
			showfilter: true, 
			highlightText: req.apps.highlightText,
			highlightFunc: highlight,
			presets: req.presets
		});
	});

	app.get('/roles/' + route + '/review', getReview, function(req, res) {
		var userInfo = req.user;
		res.render('review', {
			title: 'Application Review',
			message: req.flash('reviewError'),
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role,
			appId: req.review.appId,
			sid: req.review.auto.student_Id || '',
			lname: req.review.auto.lname || '',
			fname: req.review.auto.fname || '',
			degree: req.review.auto.degree || '',
			gpa: req.review.auto.gpa || '',
			gre: req.review.auto.gre || '',
			toefl: req.review.auto.toefl || '',
			ielts: req.review.auto.ielts || '',
			yelt: req.review.auto.yelt || '',
			unis: req.review.unis || [],
			uni_desc: req.review.unis.descriptions || [],
			status: req.review.status,
			loaded_lname: req.review.load.loaded_lname || '',
			loaded_fname: req.review.load.loaded_fname || '',
			loaded_degree: req.review.load.loaded_degree || '',
			loaded_gpa: req.review.load.loaded_gpa || '',
			loaded_gre: req.review.load.loaded_gre || '',
			loaded_background: req.review.load.loaded_background || '',
			loaded_research: req.review.load.loaded_research || '',
			loaded_letter: req.review.load.loaded_letter || '',
			loaded_comments: req.review.load.loaded_comments || '',
			loaded_rank: req.review.load.loaded_rank || '',
			loaded_uni: req.review.load.loaded_uni || '',
			loaded_assessment: req.review.load.loaded_assessment || '',
			showfilter: false
		});
	});

	app.get('/roles/' + route + '/savePreset', presetCommittee, function(req, res) {
		var userInfo = req.user;
		res.render(route, {
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
			showfilter: true,
			highlightText: req.apps.highlightText || [],
			highlightFunc: highlight,
			presets: req.presets
		});
	});

	app.post('/roles/' + route + '/savePreset', presetPost, function(req, res) {
		var userInfo = req.user;
		res.render(route, {
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
			showfilter: true,
			highlightText: req.apps.highlightText || [],
			highlightFunc: highlight,
			presets: req.presets
		});
	});

	//middleware that will help load a users preset to the filter form.
	function getPresets(req, res, next) {
		faculty_member.getPresets(req.user.id, role, function(err, results) {
			if (err) {
				next(err);
			} else {
				req.presets = results[0]['presetCommittee'];
				next();
			}
		});
	}

	//middleware that will help update/set a users preset from the filter form
	function setPreset(req, res, next) {
		var activeCols = req.body.selectedCol;
		var presetName = req.body.preset_name;
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
		if (!cols.includes('btn_col_degree')) {
			cols.push('btn_col_degree');
			colValues.push('');
		}
		if (!cols.includes('btn_col_review')) {
			cols.push('btn_col_review');
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
		filters.push('btn_filter_review');
		if (req.body.btn_filter_review && req.body.btn_filter_review !== 'Any' &&
			req.body.btn_filter_review !== '') {
			filterValues.push(req.body.btn_filter_review);
		} else {
			filterValues.push('');
		}

		var options = {
			column_name: cols,
			column_val: colValues,
			filter_name: filters,
			filter_val: filterValues
		};
		faculty_member.updatePreset(req.user.id, role, presetName, options, next);
	}

	function getApps(req, res, next) {
		req.apps = {};
		builtSql = builtOptions = null;
		getApplications(null, {reviewField: true}, req, res, next);
	}

	function setUpReview(req, res, next) {
		if (!req.query.appId) {
			res.redirect('/roles/committee');
		} else {
			req.review = {};
			prevAppId = req.review.appId = parseInt(req.query.appId, 10);
			review.getReviewStatus(req.review.appId, req.user.id, function(err, status) {
				if (err) {
					res.redirect('/roles/committee');
					return next(err);
				}
				prevStatus = req.review.status = status;
				review.loadReview(req.review.appId, req.user.id, function(err, results) {
					if (err) {
						res.redirect('/roles/committee');
						return next(err);
					}
					req.review.load = {};
					req.review.load.loaded_background = results[0]['Background'];
					req.review.load.loaded_research = results[0]['researchExp'];
					req.review.load.loaded_letter = results[0]['Letter'];
					req.review.load.loaded_comments = results[0]['Comments'];
					req.review.load.loaded_rank = results[0]['c_Rank'];
					req.review.load.loaded_uni = results[0]['PreviousInst'];
					req.review.load.loaded_assessment = results[0]['UniAssessment'];
					next();
				});
			});
		}
	}

	function getReviews(req, res, next) {
		review.autoFillReviewInfo(req.review.appId, function(err, info) {
			if (err) {
				res.redirect('/roles/committee');
				return next(err);
			}
			req.review.auto = info && info.length === 1 ? info[0]: {};
			utils.getUniversities(function(err, unis) {
				if (err) {
					res.redirect('/roles/committee');
					return next(err);
				}
				req.review.unis = unis;
				utils.getUniversityDescriptions(function(err, desc) {
					if (err) {
						res.redirect('/roles/committee');
						return next(err);
					}
					req.review.unis.descriptions = desc;
					next();
				});
			});
		});
	}

	function saveReview(req, res, next) {
		var body = req.body;
		var uni_assessment = body.draft && body.draft != '' ? JSON.parse(body.draft) 
			: (body.upload && body.upload != '' ? JSON.parse(body.upload) : '');
		var previous_uni = Array.isArray(body.prev_uni) ? body.prev_uni : 
			(body.prev_uni ? [body.prev_uni] : null);
		var data = {
			PreviousInst: previous_uni,
			UniAssessment: uni_assessment,
			Background: body.background,
			Letter: body.letter,
			researchExp: body.research,
			Comments: body.comments,
			c_Rank: body.rank === '-' ? null : body.rank,
		};
		if(body.hasOwnProperty('cancel')){
			review.setReviewStatus(prevAppId, req.user.id, prevStatus, 
				function(err, isSet) {
					prevAppId = prevStatus = null;
					if (err) {
						req.flash('tableMessage', 
							'Could not load table. Reason: ' + err.message);
					}
					if (isSet) {
						next();
					}
					else {
						req.flash('tableMessage', 
							'Could not load table. Reason: Invalid Review Status');
					}
				});
		} else if (body.hasOwnProperty('draft')) {
			review.saveReview(prevAppId, req.user.id, data, function(err, isSaved) {
				prevAppId = prevStatus = null;
				if (err) {
					req.flash('tableMessage', 
						'Could not load table. Reason: ' + err.message);
				}
				if (isSaved) {
					next();
				}
				else {
					req.flash('tableMessage', 
						'Reason: Could not save review');
				}
			});
		} else if (body.hasOwnProperty('upload')) {
			review.saveReview(prevAppId, req.user.id, data, function(err, isSaved) {
				if (err) {
					req.flash('tableMessage', 
						'Could not load table. Reason: ' + err.message);
				}
				if (isSaved) {
					review.submitReview(prevAppId, req.user.id, function(err, result) {
						prevAppId = prevStatus = null;
						if (err) {
							req.flash('tableMessage', 
								'Could not load table. Reason: ' + err.message);
						}
						if (result && result.affectedRows === 1) {
							next();
						}
						else {
							req.flash('tableMessage', 
								'Reason: Could not submit review');
						}
					});
				}
				else {
					req.flash('tableMessage', 
						'Reason: Could not save review');
				}
			});
		} else {
			next();
		}
	}

	function getApplications(sql, options, req, res, next) {
		review.getAppCount(req.user.id, function(err, count) {
			if (err) {
				req.flash('tableMessage', 
					'Error loading table. Reason: ' + err.message);
			} else if(count === 0) {
				req.flash('tableMessage', 'You currently have no reviewes assigned.');
				next();
			} else {
				application.getReviewApplications(sql, req.user.id, function(err, results) {
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
		});
	}

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
		var defaultSql = 'select application.app_Id, DATE_FORMAT(application_review.assignDate, "%m/%d/%Y") as `Date Assigned`, ' + 
		'CONCAT_WS(\' \', application.FName, application.LName) AS `Applicant Name`, application.Degree as `Degree Applied For`, ' + 
		'application_review.Status as `My Review Status`';
		
		/* build columns */
		if (cols) {
			sqlCol = 'SELECT ';
			for (var i = 0; i < cols.length; i++) {
				if (i === 0) {
					if (!cols.includes('btn_col_review'))
						sqlCol += 'application.app_Id,application_review.Status as `My Review Status`';
					else
						sqlCol += 'application.app_Id';
				}
		
				if (cols[i] === 'btn_col_date') {
					sqlCol += ',DATE_FORMAT(application_review.assignDate, "%m/%d/%Y") as `Date Assigned`';
				} else if (cols[i] === 'btn_col_name') {
					sqlCol += ',CONCAT_WS(\' \', application.FName, application.LName) AS `Applicant Name`';
				} else if (cols[i] === 'btn_col_degree') {
					sqlCol += ',application.Degree as `Degree Applied For`';
				} else if (cols[i] === 'btn_col_review') {
					sqlCol += ',application_review.Status as `My Review Status`';
					reviewField = true;
				} else if (cols[i] === 'btn_col_actions') {
					actionFieldNum = i + 1; // offset of the appId
				}
			}
		} else {
			reviewField = true;
		}

		var fromClause = ' from application inner join application_review';
		sql = (sqlCol ? sqlCol : defaultSql) + fromClause;
		
		/* build where statements */
		if (req.body.btn_filter_name && req.body.btn_filter_name !== 'Any' && 
				req.body.btn_filter_name !== '') {
			//need to put space in the first parameter of concat or it won't work. Please don't remove the space.
			sqlFilt += ' and CONCAT_WS(\' \', `FName`, `LName`)="' +
				req.body.btn_filter_name + '"';
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

	function setLiveSearchData(req, res, next) {
		utils.getApplicantNames(true, function(err, result) {
			if (err) next(err);
			req.apps['applicants'] = result;
			next();
		});
	}

	function highlight(app, field, highlightText) {
		var patternHighlight = null;
		var returnString = app[field];
	
		if (field === 'Applicant Name' && highlightText && highlightText.name && 
		highlightText.name !== '') {
			patternHighlight = new RegExp('('+highlightText.name+')', 'gi');
		} else if (field === 'Degree Applied For' && highlightText && highlightText.degree && 
		highlightText.degree !== '') {
			patternHighlight = new RegExp('('+highlightText.degree+')', 'gi');
		} else if (field === 'My Review Status' && highlightText && highlightText.review && 
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
