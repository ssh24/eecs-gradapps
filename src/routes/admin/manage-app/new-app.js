'use strict';

var fileUpload = require('express-fileupload');

module.exports = function(config, fns) {
	var app = config.app;
	var application = config.application;
	var role = config.role;
	var route = config.route;
	var main = '/new';
    
	var postNewApplication = fns.concat([createAppl]);
	
	app.use(fileUpload()); // needed for file upload
    
	// creating new application route - GET
	app.get(route + main, fns, function(req, res) {
		var userInfo = req.user;
		res.render('new-app', { 
			title: 'New Application',
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role,
			gpa: req.apps.gpa || [],
			foi: req.apps.foi || [],
			profs: req.apps.profs || [],
			showfilter: false,
		});
	});
    
	// creating new application route - POST
	app.post(route + main, postNewApplication, function(req, res) {
		res.redirect(route);
	});

	function createAppl(req, res, next) {
		var body = req.body;
		var file = req.files.app_file;
		var f_data = file.data;
	
		var data = {
			app_file: f_data
		};
			
		for(var keys in body) {
			if (keys === 'Gender') {
				var gender = body[keys] === 'Male' ? 'M' : (body[keys] === 
					'Female' ? 'F' : null);
				data[keys] = gender;
			} else if (keys === 'GPA_FINAL') {
				var isFinal = body[keys] === 'interim' ? 0 : 1;
				data[keys] = isFinal;
			} else if (keys === 'FOI' || keys === 'prefProfs') {
				data[keys] = JSON.stringify(body[keys]);
			} else if (body[keys] != '') {
				data[keys] = body[keys];
			}
		}
			
		application.createApplication(data, req.user.id, next);
	}
};
