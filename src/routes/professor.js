'use strict';

module.exports = function(app, fns) {
	// professor page route
	app.get('/roles/professor', fns, function(req, res) {
		var userInfo = req.user;
		var role = 'Professor';
		res.render('professor', { 
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
