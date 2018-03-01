'use strict';

var _ = require('lodash');

var md5 = require('apache-md5');
var fs = require('fs');
var path = require('path');
var endOfLine = require('os').EOL;

var htpasswdFile = path.resolve(__dirname, '..', '.private', '.htpasswd');
     
var User = function() {};

/**
 * Find a user by the username
 * @param {String} username 
 * @param {Function} cb 
 */
User.prototype.findUser = function(username, cb) {
	var lines;
	var user = null;
	var data = fs.readFileSync(htpasswdFile, 'utf8');
	lines = data.split('\n');
	for(var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if(line) {
			if (line.split(':')[0] === username) {
				user = username;
				break;
			}
		}
	}
	return cb(null, user);
};

/**
 * Check if a password is correct for the specific user
 * @param {String} username 
 * @param {HashedString} password 
 */
User.prototype.validPassword = function(username, password) {
	var lines, user, pass;
	var found = false;
	var data = fs.readFileSync(htpasswdFile, 'utf8');
	lines = data.split(endOfLine);
	for(var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if(line) {
			user = line.split(':')[0];
			pass = line.split(':')[1].trim();
			if (user === username) {
				found = (pass === md5(password, pass));
				break;
			}
		}
	}
	return found;
};

/**
 * Create a user in the htpasswd file
 * @param {String} username 
 * @param {String} password 
 * @param {Function} cb 
 */
User.prototype.createUser = function(username, password, cb) {
	var encrypted = md5(password);
	var data = username + ':' + encrypted + endOfLine;
	fs.appendFile(htpasswdFile, data, function (err) {
		if (err) throw err;
		return cb(err, username);
	});
};

/**
 * Remove a user in the htpasswd file
 * @param {String} username 
 * @param {Function} cb 
 */
User.prototype.removeUser = function(username, cb) {
	var lines;
	var newData = '';
	var userRemoved = false;

	var data = fs.readFileSync(htpasswdFile, 'utf8');
	lines = data.split('\n');

	_.forEach(lines, function(line) {
		if (line) {
			if (line.split(':')[0].indexOf(username) === -1) {
				newData = (newData + line).trim() + endOfLine;
			}
			else userRemoved = true;
		}
	});

	fs.writeFile(htpasswdFile, newData, function(err) {
		if (err) return cb(err);
		return cb(null, userRemoved);
	});
};

module.exports = User;
