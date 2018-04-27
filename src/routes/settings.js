'use strict';

var _ = require('lodash');
var User = require('../model/user');

module.exports = function(config, fns) {
	var app = config.app;
	var fm = config.fm;
	var utils = config.utils;
	var role = config.role;
	var route = config.route = '/settings';
	var roles = '/roles';
	var view = 'settings';
	var user = new User();
	var presetAdmin, presetCommittee, presetProf;
    
	var getEditUser = fns.concat([getUserData, getFOI]);
	var postEditUser = fns.concat([updateUser]);
    
	// editing an user route - GET
	app.get(route, getEditUser, function(req, res) {
		var userInfo = req.user;
		res.render(view, { 
			title: 'User Settings',
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role,
			foi: req.settings.foi || [],
			fm_Username: req.settings.edit.fm_Username,
			fm_Password: req.settings.edit.fm_Password,
			fm_Lname: req.settings.edit.fm_Lname,
			fm_Fname: req.settings.edit.fm_Fname,
			fm_Email: req.settings.edit.fm_Email,
			fm_FOS: req.settings.edit.fm_FOS,
			presetProf: req.settings.edit.presetProf,
			presetCommittee: req.settings.edit.presetCommittee,
			presetAdmin: req.settings.edit.presetAdmin,
			showfilter: false,
		});
	});

	// editing an user route - POST
	app.post(route, postEditUser, function(req, res) {
		if (req.auth_changed) {
			req.session.destroy(function () {
				res.redirect('/');
			});
		} else {
			res.redirect(roles);
		}
	});
    
	function getUserData(req, res, next) {
		req.settings = req.settings || {};
		fm.getUserData(req.user.id, req.user.id, function(err, result) {
			if (err) {
				res.redirect(roles);
			}
			req.settings.edit = {};
				
			req.settings.edit.fm_Username = result['fm_Username'];
			req.settings.edit.fm_Lname = result['fm_Lname'];
			req.settings.edit.fm_Fname = result['fm_Fname'];
			req.settings.edit.fm_Email = result['fm_Email'];
			req.settings.edit.fm_FOS = result['fm_FOS'];
			req.settings.edit.presetProf = presetProf = result['presetProf'];
			req.settings.edit.presetCommittee = presetCommittee = result['presetCommittee'];
			req.settings.edit.presetAdmin = presetAdmin = result['presetAdmin'];
	
			next();
		});
	}

	function updateUser(req, res, next) {
		var body = req.body;
		var user_data = {
			username: body['fm_Username'],
			password: body['new_pass']
		};
		
		utils.getMemberUsername(req.user.id, function(err, uname) {
			if (err) res.redirect(roles);
			
			req.auth_changed = (uname != user_data.username) || (body['new_pass'] 
			&& body['new_pass_confirm']);
			delete body['new_pass'];
			delete body['new_pass_confirm'];

			if (user_data.password) {
				user.updatePassword(uname, user_data.password, function(err) {
					if (err) res.redirect(roles);
					updateUserDB(req, res, next);
				});
			} else if (user_data.username) {
				user.updateUsername(uname, user_data.username, function(err) {
					if (err) res.redirect(roles);
					updateUserDB(req, res, next);
				});
			} else {
				updateUserDB(req, res, next);
			}

		});
	}

	function updateUserDB(req, res, next) {
		var body = req.body;
		var data = {};
		var allPresets;
		var preset;

		for(var keys in body) {
			if (keys === 'fm_FOS') {
				data[keys] = JSON.stringify(body[keys]);
			} else if (keys === 'presetAdmin') {
				allPresets = _.clone(presetAdmin);
				for(preset in allPresets) {
					if (!body[keys].includes(preset))
						delete allPresets[preset];
				}
				data[keys] = JSON.stringify(allPresets);
			} else if (keys === 'presetCommittee') {
				allPresets = _.clone(presetCommittee);
				for(preset in allPresets) {
					if (!body[keys].includes(preset))
						delete allPresets[preset];
				}
				data[keys] = JSON.stringify(allPresets);
			} else if (keys === 'presetProf') {
				allPresets = _.clone(presetProf);
				for(preset in allPresets) {
					if (!body[keys].includes(preset))
						delete allPresets[preset];
				}
				data[keys] = JSON.stringify(allPresets);
			} else if (body[keys] != '') {
				data[keys] = body[keys];
			}
		}

		if (presetAdmin && !body['presetAdmin']) {
			data['presetAdmin'] = JSON.stringify({});
		}
		if (presetCommittee && !body['presetCommittee']) {
			data['presetCommittee'] = JSON.stringify({});
		}
		if (presetProf && !body['presetProf']) {
			data['presetProf'] = JSON.stringify({});
		}
		
		fm.updateUser(data, req.user.id, req.user.id, next);
	}

	// setting live search data such as GPA, Professor Names, Fields of Interest(s)
	function getFOI(req, res, next) {
		req.settings = req.settings || {};
		utils.getFieldOfInterests(function(err, result) {
			if (err) next(err);
			req.settings['foi'] = result;
			next();
		});
	}
};
