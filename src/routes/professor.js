'use strict';

var _ = require('lodash');

module.exports = function(app, utils, application, faculty_member, fns) {
	var basicProfessor = fns.concat([applyApplicationActions, getApps]);
	var filterProfessor = fns.concat([applyApplicationActions, filterApps]);
	var filterPost = fns.concat([filterApps]);
	var builtSql, builtOptions, builtHighlight;

	// professor page route
	app.get('/roles/professor', basicProfessor, function(req, res) {
		var userInfo = req.user;
		var role = 'Professor';
		res.render(role, {
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
			foi: req.apps.foi || [],
			profs: req.apps.profs || [],
			gpa: req.apps.gpa || [],
			filter: req.apps.filter,
			highlightText: {
				name: '',
				gender: '',
				foi: '',
				prof: '',
				ranking: '',
				gpa: '',
				degree: '',
				visa: '',
				program_decision: '',
				contacted_by: '',
				requested_by: '',
				interest: ''
			},
			highlightFunc: highlight
		});
	});

	app.get('/roles/professor/filter', filterProfessor, function(req, res) {
		var userInfo = req.user;
		var role = 'Professor';
		res.render(role, {
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
			foi: req.apps.foi || [],
			profs: req.apps.profs || [],
			gpa: req.apps.gpa || [],
			filter: req.apps.filter,
			highlightText: req.apps.highlightText,
			highlightFunc: highlight
		});
	});

	app.post('/roles/professor/filter', filterPost,
		function(req, res) {
			var userInfo = req.user;
			var role = 'Professor';
			res.render(role, {
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
				foi: req.apps.foi || [],
				profs: req.apps.profs || [],
				gpa: req.apps.gpa || [],
				filter: req.apps.filter,
				highlightText: req.apps.highlightText,
				highlightFunc: highlight
			});
		});

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

					if (!options.interestField)
						hidden.push('My Interest Status');
					if (!options.contactedField)
						hidden.push('Contacted By');
					if (!options.requestedField)
						hidden.push('Requested By');
				}

				req.apps.appls = results;

				req.apps.flds = {};
				req.apps.flds.fields = fields;
				req.apps.flds.hidden = hidden;
			}

			setLiveSearchData(req, res, next);
		});
	}

	function getApps(req, res, next) {
		req.apps = {filter: false};
		builtSql = builtOptions = null;
		getApplications(null, {
			interestField: true,
			contactedField: true,
			requestedField: true
		}, req, res, next);
	}

	function filterApps(req, res, next) {
		req.apps = {
			filter: true
		};

		var cols = req.body.selectedCol;
		var sql = 'SELECT ';
		var sqlCol = '';
		var sqlFilt = '';
		var contactedField;
		var requestedField;
		var interestField;
		var actionFieldNum;
		var gpaFilt = false;
		var rankFilt;
		var highlightText = {};

		var interestStatusSql = ' LEFT JOIN APPLICATION_SEEN ON APPLICATION.app_Id ' +
		'= APPLICATION_SEEN.appId and APPLICATION_SEEN.fmId=' + req.user.id;
		var gpaSql = ' INNER JOIN GPA on APPLICATION.GPA = GPA.letter_grade';

		// default sql
		sqlCol += 'app_Id, CONCAT_WS(\' \', `FName`, `LName`) AS `Applicant Name`, ' +
		'Gender, FOI as `Fields of Interest`, prefProfs as `Preferred Professors`, ' +
		'Rank as `Committee Rank`, GPA, Degree as `Degree Applied For`,' +
		' VStatus as `Visa Status`, programDecision as `Program Decision`,';

		/* build columns */
		if (cols) {
			for (var i = 0; i < cols.length; i++) {
				if (i === 0)
					sqlCol = 'app_Id, ';

				if (cols[i] === 'btn_col_name') {
					sqlCol += 'CONCAT_WS(\' \', `FName`, `LName`) AS `Applicant Name`,';
				} else if (cols[i] === 'btn_col_gender') {
					sqlCol += 'Gender,';
				} else if (cols[i] === 'btn_col_foi') {
					sqlCol += 'FOI as `Fields of Interest`,';
				} else if (cols[i] === 'btn_col_prof') {
					sqlCol += 'prefProfs as `Preferred Professors`,';
				} else if (cols[i] === 'btn_col_ranking') {
					sqlCol += 'Rank as `Committee Rank`,';
				} else if (cols[i] === 'btn_col_gpa') {
					sqlCol += 'GPA,';
				} else if (cols[i] === 'btn_col_degree') {
					sqlCol += 'Degree as `Degree Applied For`,';
				} else if (cols[i] === 'btn_col_visa') {
					sqlCol += 'VStatus as `Visa Status`,';
				} else if (cols[i] === 'btn_col_program_decision') {
					sqlCol += 'programDecision as `Program Decision`,';
				} else if (cols[i] === 'btn_col_contacted_status') {
					contactedField = true;
				} else if (cols[i] === 'btn_col_requested_status') {
					requestedField = true;
				} else if (cols[i] === 'btn_col_interest') {
					interestField = true;
				} else if (cols[i] === 'btn_col_actions') {
					actionFieldNum = i + 1; // offset of the appId
				}
			}
		} else {
			interestField = true;
			contactedField = true;
			requestedField = true;
		}

		/* build where statements */
		if (req.body.btn_filter_name && req.body.btn_filter_name !== 'Any' &&
		req.body.btn_filter_name !== '') {
			//need to put space in the first parameter of concat or it won't work. Please don't remove the space.
			sqlFilt += ' and CONCAT_WS(\' \', `FName`, `LName`)="' +
			req.body.btn_filter_name + '"';
			highlightText.name = req.body.btn_filter_name;
		}
		if (req.body.btn_filter_gender && req.body.btn_filter_gender !== 'Any' &&
		req.body.btn_filter_gender !== '') {
			sqlFilt += ' and Gender="' + req.body.btn_filter_gender + '"';
			highlightText.gender = req.body.btn_filter_gender;
		}
		if (req.body.btn_filter_foi &&
		req.body.btn_filter_foi !== 'Any' && req.body.btn_filter_foi !== '') {
			sqlFilt += ' and JSON_CONTAINS(foi, \'"' +
			req.body.btn_filter_foi + '"\')';
			highlightText.foi = req.body.btn_filter_foi;
		}
		if (req.body.btn_filter_prof && req.body.btn_filter_prof !== 'Any' &&
		req.body.btn_filter_prof !== '') {
			sqlFilt += ' and JSON_CONTAINS(prefProfs, \'"' +
			req.body.btn_filter_prof + '"\')';
			highlightText.prof = req.body.btn_filter_prof;
		}
		if (req.body.btn_filter_ranking && req.body.btn_filter_ranking !== 'Any' &&
		req.body.btn_filter_ranking !== '') {
			rankFilt = true;
			highlightText.ranking = req.body.btn_filter_ranking;
		}
		if (req.body.btn_filter_gpa && req.body.btn_filter_gpa !== 'Any' &&
		req.body.btn_filter_gpa !== '') {
			gpaFilt = true;
			sqlFilt += ' and gpa.grade_point' + req.body.btn_filter_gpa.split(' ')[0] +
			'(select grade_point ' + 'from gpa where letter_grade = "' +
			req.body.btn_filter_gpa.split(' ')[1] + '")';
			highlightText.gpa = req.body.btn_filter_gpa;
		}
		if (req.body.btn_filter_degree && req.body.btn_filter_degree !== 'Any' &&
		req.body.btn_filter_degree !== '') {
			sqlFilt += ' and Degree="' + req.body.btn_filter_degree + '"';
			highlightText.degree = req.body.btn_filter_degree;
		}
		if (req.body.btn_filter_visa && req.body.btn_filter_visa !== 'Any' &&
		req.body.btn_filter_visa !== '') {
			sqlFilt += ' and VStatus="' + req.body.btn_filter_visa + '"';
			highlightText.visa = req.body.btn_filter_visa;
		}
		if (req.body.btn_filter_program_decision &&
		req.body.btn_filter_program_decision !== 'Any' &&
		req.body.btn_filter_program_decision !== '') {
			sqlFilt += ' and programDecision="' + req.body.btn_filter_program_decision +
			'"';
			highlightText.program_decision = req.body.btn_filter_program_decision;
		}
		if (req.body.btn_filter_contacted_by &&
		req.body.btn_filter_contacted_by !== 'Any' &&
		req.body.btn_filter_contacted_by !== '') {
			contactedField = true;
			sqlFilt += ' and JSON_CONTAINS(profContacted, \'"' +
			req.body.btn_filter_contacted_by + '"\')';
			highlightText.contacted_by = req.body.btn_filter_contacted_by;
		}
		if (req.body.btn_filter_requested_by &&
		req.body.btn_filter_requested_by !== 'Any' &&
		req.body.btn_filter_requested_by !== '') {
			requestedField = true;
			sqlFilt += ' and JSON_CONTAINS(profRequested, \'"' +
			req.body.btn_filter_requested_by + '"\')';
			highlightText.requested_by = req.body.btn_filter_requested_by;
		}
		if (req.body.btn_filter_interest && req.body.btn_filter_interest !== 'Any' &&
		req.body.btn_filter_interest !== '') {
			interestField = true;
			if (req.body.btn_filter_interest === 'Interested') {
				sqlFilt += ' and seen=1';
			} else if (req.body.btn_filter_interest === 'Not Interested') {
				sqlFilt += ' and seen=0';
			} else if (req.body.btn_filter_interest === '-') {
				sqlFilt += ' and seen is null';
			}
			highlightText.interest = req.body.btn_filter_interest;
		}

		var joinSql = gpaFilt ? gpaSql + interestStatusSql : interestStatusSql;
		if (rankFilt && rankFilt === true) {
			utils.buildCommitteeRankFilter(req.body.btn_filter_ranking.split(' ')[0],
				req.body.btn_filter_ranking.split(' ')[1], function(err, result) {
					if (err) next(err);
					if (result) {
						sqlFilt += ' and ' + result;
						proceed();
					}
				});
		} else if (!(rankFilt && rankFilt === true)) {
			proceed();
		} else {
			next();
		}

		function proceed() {
			sql += sqlCol + 'profContacted as `Contacted By`, profRequested as ' +
			'`Requested By`, seen as `My Interest Status` FROM APPLICATION' +
			joinSql + ' WHERE committeeReviewed=1 and Rank is not null' +
			sqlFilt;

			var options = {
				actionFieldNum: actionFieldNum,
				interestField: interestField,
				contactedField: contactedField,
				requestedField: requestedField
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
	}

	function applyApplicationActions(req, res, next) {
		var query = req.query;
		if (query.interest === 'false') {
			application.updateInterestedStatus(query.appId, req.user.id, 0, next);
		} else if(query.interest === 'true') {
			application.updateInterestedStatus(query.appId, req.user.id, 1, next);
		}  else if (query.contacted === 'false') {
			application.updateContactedStatus(query.appId, req.user.id,
				req.user.fullname, 0, next);
		} else if (query.contacted === 'true') {
			application.updateContactedStatus(query.appId, req.user.id,
				req.user.fullname, 1, next);
		} else if (query.requested === 'false') {
			application.updateRequestedStatus(query.appId, req.user.id,
				req.user.fullname, 0, next);
		} else if (query.requested === 'true') {
			application.updateRequestedStatus(query.appId, req.user.id,
				req.user.fullname, 1, next);
		} else {
			next();
		}
	}

	function setLiveSearchData(req, res, next) {
		utils.getApplicantNames(function(err, result) {
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

	//This is a helper function that should be called after the filter has returned a table.
	//It takes an application and a field and checks if that field has text that should be highlighted
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

		if (field === 'Applicant Name' && highlightText.name &&
		highlightText.name !== '') {
			patternHighlight = new RegExp('('+highlightText.name+')', 'gi');
		} else if (field === 'Gender' && highlightText.gender &&
		highlightText.gender !== '') {
			patternHighlight = new RegExp('('+highlightText.gender+')', 'gi');
		} else if (field === 'Fields of Interest' && highlightText.foi &&
		highlightText.foi !== '') {
			patternHighlight = new RegExp('('+highlightText.foi+')', 'gi');
		} else if (field === 'Preferred Professors' && highlightText.prof &&
		highlightText.prof !== '') {
			patternHighlight = new RegExp('('+highlightText.prof+')', 'gi');
		} else if (field === 'Committee Rank' && highlightText.ranking &&
		highlightText.ranking !== '') {
			if (patt_Aplus.test(highlightText.ranking)) {
				patternHighlight = patt_Aplus;
			} else if (patt_A.test(highlightText.ranking)) {
				patternHighlight = patt_A;
			} else if (patt_Bplus.test(highlightText.ranking)) {
				patternHighlight = patt_Bplus;
			} else if (patt_B.test(highlightText.ranking)) {
				patternHighlight = patt_B;
			} else if (patt_Cplus.test(highlightText.ranking)) {
				patternHighlight = patt_Cplus;
			} else if (patt_C.test(highlightText.ranking)) {
				patternHighlight = patt_C;
			} else if (patt_Dplus.test(highlightText.ranking)) {
				patternHighlight = patt_Dplus;
			} else if (patt_D.test(highlightText.ranking)) {
				patternHighlight = patt_D;
			} else if (patt_E.test(highlightText.ranking)) {
				patternHighlight = patt_E;
			} else if (patt_F.test(highlightText.ranking)) {
				patternHighlight = patt_F;
			} else {
				patternHighlight = null;
			}
		} else if (field === 'GPA' && highlightText.gpa && highlightText.gpa !== '') {
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
		} else if (field === 'Degree Applied For' && highlightText.degree &&
		highlightText.degree !== '') {
			patternHighlight = new RegExp('('+highlightText.degree+')', 'gi');
		} else if (field === 'Visa Status' && highlightText.visa && highlightText.visa !== '') {
			patternHighlight = new RegExp('('+highlightText.visa+')', 'gi');
		} else if (field === 'Program Decision' && highlightText.program_decision
		&& highlightText.program_decision !== '') {
			patternHighlight = new RegExp('('+highlightText.program_decision+')', 'gi');
		} else if (field === 'Contacted By' && highlightText.contacted_by &&
		highlightText.contacted_by !== '') {
			patternHighlight = new RegExp('('+highlightText.contacted_by+')', 'gi');
		} else if (field === 'Requested By' && highlightText.requested_by &&
		highlightText.requested_by !== '') {
			patternHighlight = new RegExp('('+highlightText.requested_by+')', 'gi');
		} else if (field === 'My Interest Status' && highlightText.interest &&
		highlightText.interest !== '') {
			patternHighlight = new RegExp('('+highlightText.interest+')', 'gi');
		} else {
			patternHighlight = null;
		}
		if (patternHighlight != null) {
			if (app[field]) {
				var word = app[field].toString();
				returnString = word.replace(patternHighlight,
					'<span style="color:red">$1</span>');
			}
		}
		return returnString;
	}
};
