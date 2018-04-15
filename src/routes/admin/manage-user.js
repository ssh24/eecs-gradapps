'use strict';

module.exports = function(config, fns) {
	var app = config.app;
	// var application = config.application;
	var fm = config.fm;
	// var utils = config.utils;
	var role = config.role;
	var route = config.route = '/roles/admin/users';
	var view = 'manage-user';
    
	var basicUser = fns.concat([loadUsers]);
    
	// managing user route
	app.get(route, basicUser, defaultView);
    
	function defaultView(req, res) {
		var userInfo = req.user;
		res.render(view, { 
			title: 'Users',
			message: req.flash('tableMessage'),
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role,
			users: req.users.infos || [],
			fields: req.users.flds ? (req.users.flds.fields || []) : [],
			hidden: req.users.flds ? (req.users.flds.hidden || []) : [],
			filter: false,
			showfilter: false
		});
	}
    
	function loadUsers(req, res, next) {
		req.users = {};
		fm.getUserInfo(req.user.id, function(err, results) {
			if (err) {
				req.flash('tableMessage', 
					'Error loading table. Fatal reason: ' + err.message);
			} else {
				var fields = [];
				var hidden = ['fm_Id'];
				var obj = results[0];
			
				for (var key in obj)
					fields.push(key);
			
				fields.push('Actions');

				req.users.infos = results;

				req.users.flds = {};
				req.users.flds.fields = fields;
				req.users.flds.hidden = hidden;
			}
			next();
		});
	}
};
