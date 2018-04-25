'use strict';

module.exports = function(app, fns) {
	// admin page route
	app.get('/roles/admin', fns, function(req, res) {
		var userInfo = req.user;
		var role = 'Admin';
		res.render('admin', { 
			title: 'Welcome ' + role,
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role,
			showfilter: false,
			review: false
		});
	});
};
