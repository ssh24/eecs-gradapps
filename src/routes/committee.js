'use strict';

module.exports = function(app, fns) {
	// committee page route
	app.get('/roles/committee', fns, function(req, res) {
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
};
