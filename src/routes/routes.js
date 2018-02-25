'use strict';

var mysql = require('mysql2');
var config = require('../test/lib/utils/config');
var creds = config.credentials.database;
var connection = mysql.createConnection(creds);
connection.connect();

var Authentication = require('../controller/auth');
var Application = require('../controller/application');
var Utils = require('../controller/utils');

var auth = new Authentication(connection);
var application = new Application(connection);
var utils = new Utils(connection);

module.exports = function(app, passport) {
	// home page route
	app.get('/', function(req, res) {
		res.render('index', {
			title: 'Welcome to Grad Apps',
			user: null,
			role: null
		});
	});

	/** LOGIN PAGE ROUTE */
	app.get('/login', function(req, res) {
		res.render('login', {
			message: req.flash('loginMessage'),
			title: 'Login',
			user: null,
			role: null
		});
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/roles', // redirect to the secure profile section
		failureRedirect: '/login', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	// roles page route
	app.get('/roles', isLoggedIn, function(req, res) {
		var userInfo = req.user;
		res.render('roles', {
			title: 'Role Selection',
			confirmation: 'You have been successfully logged into the system.',
			user: userInfo.id,
			roles: userInfo.roles,
			fname: userInfo.fname,
			role: null
		});
	});

	// admin page route
	app.get('/roles/admin', [isLoggedIn, selectRole], function(req, res) {
		var userInfo = req.user;
		var role = 'Admin';
		res.render(role, {
			title: 'Welcome ' + role,
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role
		});
	});

	// professor page route
	app.get('/roles/professor', [isLoggedIn, selectRole, applyApplicationActions, 
		getApps], function(req, res) {
		var userInfo = req.user;
		var role = 'Professor';
		res.render(role, {
			title: 'Applications',
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role,
			apps: req.apps.appls,
			fields: req.apps.flds.fields,
			hidden: req.apps.flds.hidden,
			applicants: req.apps.applicants,
			foi: req.apps.foi,
			profs: req.apps.profs,
			gpa: req.apps.gpa,
			filter: req.apps.filter 
		});
	});

	app.post('/roles/professor', [isLoggedIn, selectRole, filterApps], function(req, res) {
		var userInfo = req.user;
		var role = 'Professor';
		res.render(role, {
			title: 'Filtered Applications',
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role,
			apps: req.apps.appls,
			fields: req.apps.flds.fields,
			hidden: req.apps.flds.hidden,
			applicants: req.apps.applicants,
			foi: req.apps.foi,
			profs: req.apps.profs,
			gpa: req.apps.gpa,
			filter: req.apps.filter
		});
	});

	// committee page route
	app.get('/roles/committee', [isLoggedIn, selectRole], function(req, res) {
		var userInfo = req.user;
		var role = 'Committee Member';
		res.render('Committee', {
			title: 'Welcome ' + role,
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role
		});
	});

	// logout page route
	app.get('/logout', [isLoggedIn, performLogout], function(req, res) {
		req.session.destroy(function() {
			res.redirect('/');
		});
	});
};

/************ HELPER FUNCTIONS ************/

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}

function selectRole(req, res, next) {
	if (req.path.indexOf('admin') > -1) {
		auth.selectRole(req.user.id, 'Admin', next);
	} else if (req.path.indexOf('professor') > -1) {
		auth.selectRole(req.user.id, 'Professor', next);
	} else if (req.path.indexOf('committee') > -1) {
		auth.selectRole(req.user.id, 'Committee Member', next);
	} else {
		next();
	}
}

function performLogout(req, res, next) {
	auth.logOut(req.user.id, next);
}

function getApps(req, res, next) {
	application.getApplications(null, req.user.id, function(err, results) {
		if (err) next(err);
		var fields = [];
		var obj = results[0];

		for (var key in obj)
			fields.push(key);
		fields.push('Actions');

		req.apps = {
			appls: results,
			flds: {
				fields: fields,
				hidden: ['app_Id']
			},
			filter: false
		};
		setLiveSearchData(req, res, next);
	});
}

function filterApps(req, res, next) {
	var cols = req.body.selectedCol;
	var sql = 'SELECT ';
	var sqlCol = '';
	var sqlFilt = '';
	var contactedField = false;
	var requestedField = false;
	var interestField = false;
	var actionsField = false;
	var actionFieldNum;
	var gpaFilt = false;

	var interestStatusSql = ' LEFT JOIN APPLICATION_SEEN ON APPLICATION.app_Id = APPLICATION_SEEN.appId and APPLICATION_SEEN.fmId=' + req.user.id;
	var gpaSql = ' INNER JOIN GPA on APPLICATION.GPA = GPA.letter_grade';

	// default sql
	sqlCol += 'app_Id, CONCAT_WS(\' \', `FName`, `LName`) AS `Applicant Name`, ' +
    'FOI as `Field of Interests`, prefProfs as `Preferred Professors`, ' +
    'Rank as `Committee Rank`, GPA, Degree as `Degree Applied For`,' +
    ' VStatus as `Visa Status`,';

	/* build columns */
	if (cols) {
		for (var i = 0; i < cols.length; i++) {
			if (i === 0) sqlCol = 'app_Id, ';

			if (cols[i] === 'btn_col_name') {
				sqlCol += 'CONCAT_WS(\' \', `FName`, `LName`) AS `Applicant Name`,';
			} else if (cols[i] === 'btn_col_gender') {
				sqlCol += 'Gender,';
			} else if (cols[i] === 'btn_col_foi') {
				sqlCol += 'FOI as `Field of Interests`,';
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
			} else if (cols[i] === 'btn_col_contacted_status') {
				contactedField = true;
			} else if (cols[i] === 'btn_col_requested_status') {
				requestedField = true;
			} else if (cols[i] === 'btn_col_interest') {
				interestField = true;
			} else if (cols[i] === 'btn_col_actions') {
				actionsField = true;
				actionFieldNum = i + 1; // the one is for the offset of the appId
			}
		}
	}

	/* build where statements */
	if (req.body.btn_filter_name !== 'Any' && req.body.btn_filter_name !== '') {
		sqlFilt += ' and CONCAT_WS(\'\', `FName`, `LName`)=' + 
		req.body.btn_filter_name;
	}
	if (req.body.btn_filter_gender !== 'Any' && req.body.btn_filter_gender !== '') {
		sqlFilt += ' and Gender="' + req.body.btn_filter_gender + '"';
	}
	if (req.body.btn_filter_foi !== 'Any' && req.body.btn_filter_foi !== '') {
		sqlFilt += ' and JSON_CONTAINS(foi, \'"' + 
		req.body.btn_filter_foi + '"\')';
	}
	if (req.body.btn_filter_prof !== 'Any' && req.body.btn_filter_prof !== '') {
		sqlFilt += ' and JSON_CONTAINS(prefProfs, \'"' + 
		req.body.btn_filter_prof + '"\')';
	}
	if (req.body.btn_filter_ranking !== 'Any' && 
	req.body.btn_filter_ranking !== '') {
		sqlFilt += ' and JSON_CONTAINS(Rank, \'"' + 
		req.body.btn_filter_ranking + '"\')';
	}
	if (req.body.btn_filter_gpa !== 'Any' && req.body.btn_filter_gpa !== '') {
		gpaFilt = true;
		var operation = req.body.btn_filter_gpa.split(' ')[0];
		var letter_grade = req.body.btn_filter_gpa.split(' ')[1];
		sqlFilt += ' and gpa.grade_point' + operation + '(select grade_point ' + 
		'from gpa where letter_grade = "' + letter_grade + '")';
	}
	if (req.body.btn_filter_degree !== 'Any' && 
	req.body.btn_filter_degree !== '') {
		sqlFilt += ' and Degree="' + req.body.btn_filter_degree + '"';
	}
	if (req.body.btn_filter_visa !== 'Any' && req.body.btn_filter_visa !== '') {
		sqlFilt += ' and VStatus="' + req.body.btn_filter_visa + '"';
	}
	if (req.body.btn_filter_contacted_by !== 'Any' && 
	req.body.btn_filter_contacted_by !== '') {
		contactedField = true;
		sqlFilt += ' and JSON_CONTAINS(profContacted, \'"' + 
		req.body.btn_filter_contacted_by + '"\')';
	}
	if (req.body.btn_filter_requested_by !== 'Any' && 
	req.body.btn_filter_requested_by !== '') {
		requestedField = true;
		sqlFilt += ' and JSON_CONTAINS(profRequested, \'"' + 
		req.body.btn_filter_requested_by + '"\')';
	}
	if (req.body.btn_filter_interest !== 'Any' && 
	req.body.btn_filter_interest !== '') {
		interestField = true;
		if (req.body.btn_filter_interest === 'Interested') {
			sqlFilt += ' and seen=1';
		} else if (req.body.btn_filter_interest === 'Not Interested') {
			sqlFilt += ' and seen=0';
		} else if (req.body.btn_filter_interest === '-') {
			sqlFilt += ' and seen is null';
		}
	}
	
	var joinSql = gpaFilt ? gpaSql + interestStatusSql : interestStatusSql;
	sql += sqlCol + 'profContacted as `Contacted By`, profRequested as ' + 
	'`Requested By`, seen as `My Interest Status` FROM APPLICATION' + joinSql +
	' WHERE committeeReviewed=1 and Rank is not null' + sqlFilt;

	console.log('SQL query >>> %s', sql);

	application.getApplications(sql, req.user.id, function(err, results) {
		if (err) next(err);
		var fields = [];
		var hidden = ['app_Id'];
		var obj = results[0];
		for (var key in obj)
			fields.push(key);

		if(!actionsField && !actionFieldNum) fields.push('Actions');
		else fields.splice(actionFieldNum, 0, 'Actions');
		
		if (!interestField)
			hidden.push('My Interest Status');
		if (!contactedField)
			hidden.push('Contacted By');
		if (!requestedField)
			hidden.push('Requested By');

		req.apps = {
			appls: results,
			flds: {
				fields: fields,
				hidden: hidden
			},
			filter: true
		};
		setLiveSearchData(req, res, next);
	});
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
