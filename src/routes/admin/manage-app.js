'use strict';

module.exports = function(config, fns) {
	var app = config.app;
	var application = config.application;
	var role = config.role;
	var route = config.route = '/roles/admin/applications';
	
	var basicAdmin = fns.concat([getApps]);
    
	// managing application route
	app.get(route, basicAdmin, defaultView);

	require('./manage-app/new-app')(config, basicAdmin);
	require('./manage-app/view-app')(config, fns);
    
	function defaultView(req, res) {
		var userInfo = req.user;
		res.render('manage-app', { 
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
			filter: req.apps.filter || false,
			// highlightText: {},
			// highlightFunc: highlight,
		});
	}

	function getApps(req, res, next) {
		req.apps = {filter: false};
		// builtSql = builtOptions = null;
		var sql = 'SELECT app_Id, DATE_FORMAT(app_Date, "%m/%d/%Y") as `Date Uploaded`, student_Id as `Student Number`, CONCAT_WS(\' \', `FName`, `LName`) AS `Applicant Name`, ' +
		'GPA, Degree as `Degree Applied For`, ' +
		'VStatus as `Visa Status`, programDecision as `Program Decision` ' +
		'FROM APPLICATION order by app_Date';
		getApplications(sql, {}, req, res, next);
	}

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
			next();
		});
	}
};
