'use strict';

module.exports = function(app, fns) {
	var route;
	var role = route = 'Admin';

	// admin page route
	app.get('/roles/' + route, fns, function(req, res) {
		var userInfo = req.user;
		res.render(role, { 
			title: 'Welcome ' + role,
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role,
			showfilter: false
		});
	});

	// managing user route
	app.get('/roles/' + route + '/users', fns, function(req, res) {
		var userInfo = req.user;
		res.render('manage-user', { 
			title: 'Welcome ' + role,
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role,
			showfilter: false
		});
	});

	// managing application route
	app.get('/roles/' + route + '/applications', fns, function(req, res) {
		var userInfo = req.user;
		res.render('manage-app', { 
			title: 'Welcome ' + role,
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role,
			showfilter: false
		});
	});

	// managing review route
	app.get('/roles/' + route + '/reviews', fns, function(req, res) {
		var userInfo = req.user;
		res.render('manage-review', { 
			title: 'Welcome ' + role,
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role,
			showfilter: false
		});
	});
};
