'use strict';

module.exports = function(app, fns) {
	// roles page route
	app.get('/roles', fns, function(req, res) {
		var userInfo = req.user;
		res.render('roles', { 
			title: 'Role Selection',
			confirmation: 'You have been successfully logged into the system.',
			user: userInfo.id,
			roles: userInfo.roles, 
			fname: userInfo.fname,
			role: null,
			showfilter: false,
			review: false
		});
	});
};
