'use strict';

var _ = require('lodash');
var User = require('../../../model/user');

module.exports = function(config, fns) {
	var app = config.app;
	var fm = config.fm;
	var utils = config.utils;
	var role = config.role;
	var route = config.route;
	var main = '/edit';
	var view = 'edit-user';
	var user = new User();
	var userId, presetAdmin, presetCommittee, presetProf;
    
	var getEditUser = fns.concat([getUserData]);
	var postEditUser = fns.concat([updateOrDeleteUser]);
    
	// editing an user route - GET
	app.get(route + main, getEditUser, function(req, res) {
		var userInfo = req.user;
		res.render(view, { 
			title: 'Edit User',
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role,
			foi: req.users.foi || [],
			userId: parseInt(req.query.userId),
			fm_Username: req.users.edit.fm_Username,
			fm_Lname: req.users.edit.fm_Lname,
			fm_Fname: req.users.edit.fm_Fname,
			fm_Email: req.users.edit.fm_Email,
			fm_FOS: req.users.edit.fm_FOS,
			fm_Roles: req.users.edit.fm_Roles,
			presetProf: req.users.edit.presetProf,
			presetCommittee: req.users.edit.presetCommittee,
			presetAdmin: req.users.edit.presetAdmin,
			showfilter: false,
		});
	});

	// editing an user route - POST
	app.post(route + main, postEditUser, function(req, res) {
		res.redirect(route);
	});
    
	function getUserData(req, res, next) {
		userId = parseInt(req.query.userId);
		if (!userId || userId === req.user.id)
			res.redirect(route);
		else {
			fm.getUserData(userId, req.user.id, function(err, result) {
				if (err) {
					res.redirect(route);
				}
				req.users.edit = {};
				
				req.users.edit.fm_Username = result['fm_Username'];
				req.users.edit.fm_Lname = result['fm_Lname'];
				req.users.edit.fm_Fname = result['fm_Fname'];
				req.users.edit.fm_Email = result['fm_Email'];
				req.users.edit.fm_FOS = result['fm_FOS'];
				
				req.users.edit.fm_Roles = result['fm_Roles'];
				req.users.edit.presetProf = presetProf = result['presetProf'];
				req.users.edit.presetCommittee = presetCommittee = result['presetCommittee'];
				req.users.edit.presetAdmin = presetAdmin = result['presetAdmin'];
	
				next();
			});
		}
	}

	function updateOrDeleteUser(req, res, next) {
		var body = req.body;
		var user_data = {
			username: body['fm_Username'],
			password: body['pass']
		};
		delete body['pass'];

		utils.getMemberUsername(userId, function(err, uname) {
			if (err) res.redirect(route);
			if (body.update === '') {
				if (user_data.password) {
					user.updatePassword(uname, user_data.password, function(err) {
						if (err) res.redirect(route);
						updateUserDB(req, res, next);
					});
				} else if (user_data.username) {
					user.updateUsername(uname, user_data.username, function(err) {
						if (err) res.redirect(route);
						updateUserDB(req, res, next);
					});
				} 
			} else if (body.delete === '') {
				user.removeUser(uname, function(err) {
					if (err) res.redirect(route);
					else fm.deleteUser(userId, req.user.id, next);
				});
			}
		});
	}

	function updateUserDB(req, res, next) {
		var body = req.body;
		var data = {};
		var allPresets;
		
		for(var keys in body) {
			if (keys === 'fm_FOS' || keys === 'fm_Roles') {
				data[keys] = JSON.stringify(body[keys]);
			} else if (keys === 'presetAdmin' || keys === 'presetCommittee' 
							|| keys === 'presetProf') {
				if (keys === 'presetAdmin' ) 
					allPresets = _.clone(presetAdmin);
				else if (keys === 'presetCommittee') 
					allPresets = _.clone(presetCommittee);
				else 
					allPresets = _.clone(presetProf);
				for(var preset in allPresets) {
					if (!body[keys].includes(preset))
						delete allPresets[preset];
				}
				data[keys] = JSON.stringify(allPresets);
			} else if (body[keys] != '') {
				data[keys] = body[keys];
			}
		}
		fm.updateUser(data, userId, req.user.id, next);
	}
};
