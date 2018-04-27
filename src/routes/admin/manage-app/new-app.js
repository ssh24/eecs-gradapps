'use strict';

var async = require('async');
var fileUpload = require('express-fileupload');

module.exports = function(config, fns) {
	var app = config.app;
	var application = config.application;
	var review = config.review;
	var utils = config.utils;
	var role = config.role;
	var route = config.route;
	var main = '/new';
	var cms;
	
	var getNewApplication = fns.concat([getAppl]);
	var postNewApplication = fns.concat([createAppl]);
	
	app.use(fileUpload()); // needed for file upload
    
	// creating new application route - GET
	app.get(route + main, getNewApplication, function(req, res) {
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
			cms: req.apps.cms || [],
			showfilter: false,
		});
	});
    
	// creating new application route - POST
	app.post(route + main, postNewApplication, function(req, res) {
		res.redirect(route);
	});

	function getAppl(req, res, next) {
		utils.getAllCommitteeMembers(function(err, rcms) {
			if (err) res.redirect(route);
			req.apps.cms = cms = rcms;
			next();
		});
	}

	function createAppl(req, res, next) {
		var body = req.body;
		var file = req.files.app_file;
		var f_data = file.data;
		var reviewers = body['Reviewers'] && Array.isArray(body['Reviewers']) ? body['Reviewers'] : [body['Reviewers']];
		delete body['Reviewers'];
	
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
			} else if (keys === 'ygsAwarded') {
				var isAwarded = body[keys] === 'no-ygs' ? 0 : 1;
				data[keys] = isAwarded;
			} else if (keys === 'FOI' || keys === 'prefProfs') {
				data[keys] = JSON.stringify(body[keys]);
			} else if (body[keys] != '') {
				data[keys] = body[keys];
			}
		}
			
		application.createApplication(data, req.user.id, function(err, result) {
			if (err) res.redirect(route);
			var appId = result && result['insertId'];
			var rev_ids = [];
			async.each(cms, function(cm, cb1) {
				if (reviewers.includes(cm['name'])) rev_ids.push(cm['id']);
				cb1();
			}, function() {
				async.each(rev_ids, function(id, cb2) {
					review.assignReview(appId, id, req.user.id, cb2);
				}, next);
			});
		});
	}
};
