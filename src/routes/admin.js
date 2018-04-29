'use strict';

module.exports = function(config, fns) {
	var app = config.app;

	var route;
	var role = route = config.role = 'Admin';

	// admin page route
	app.get('/roles/' + route, fns, function(req, res) {
		var userInfo = req.user;
		res.render('admin', { 
			title: 'Administrator Dashboard',
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role,
			showfilter: false
		});
	});

	require('./admin/manage-app')(config, fns);
	require('./admin/view-review')(config, fns);
	require('./admin/manage-user')(config, fns);
};
