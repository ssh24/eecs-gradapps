'use strict';

module.exports = function(config, fns) {
	var app = config.app;
	var fm = config.fm;
	var utils = config.utils;
	var role = config.role;
	var route = config.route;
	var main = '/new';
	var view = 'new-user';
	
	var getNewUser = fns.concat([setLiveSearchData]);
	var postNewUser = fns.concat([createUser]);
    
	// creating new application route - GET
	app.get(route + main, getNewUser, function(req, res) {
		var userInfo = req.user;
		res.render(view, { 
			title: 'New User',
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role,
			foi: req.users.foi || [],
			showfilter: false,
		});
	});
    
	// creating new application route - POST
	app.post(route + main, postNewUser, function(req, res) {
		res.redirect(route);
	});

	function createUser(req, res, next) {
		var body = req.body;
		var data = {};
			
		for(var keys in body) {
			if (keys === 'fm_FOS' || keys === 'fm_Roles') {
				data[keys] = JSON.stringify(body[keys]);
			} else if (body[keys] != '') {
				data[keys] = body[keys];
			}
		}
			
		fm.createUser(data, req.user.id, next);
	}

	// live search data for field of interest
	function setLiveSearchData(req, res, next) {
		req.users = req.users || {};
		utils.getFieldOfInterests(function(err, result) {
			if (err) next(err);
			req.users['foi'] = result;
			next();
		});
	}
};
