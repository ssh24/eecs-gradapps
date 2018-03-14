'use strict';

module.exports = function(app, utils, application, fns) {
	var basicCommittee = fns.concat([getApps]);

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
			filter: req.apps.filter
		});
	});

	function getApps(req, res, next) {
		req.apps = {filter: false};
		getApplications(null, {}, req, res, next);
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
