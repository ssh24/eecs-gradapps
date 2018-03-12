'use strict';

module.exports = function(app, fns) {
	// professor page route
	app.get('/roles/professor', fns, function(req, res) {
		var userInfo = req.user;
		var role = 'Professor';
		res.render(role, { 
			title: 'Welcome ' + role,
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role
		});
	});
};
