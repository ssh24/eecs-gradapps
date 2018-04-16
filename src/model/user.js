'use strict';

var assert = require('assert');
var md5 = require('apache-md5');
var fs = require('fs');
var path = require('path');
var endOfLine = require('os').EOL;

// this file path can be pointed to any server located file or local file for htpasswd to work
// for security reasons, all htpasswd should be bycrypted
var htpasswdFile = path.resolve(__dirname, '..', '.private', '.htpasswd');

var User = function() {
	this.separator = ':';
};

/**
 * Create a new user.
 * @param {String} username 
 * @param {String} password 
 * @param {Function} cb 
 */
User.prototype.createUser = function(username, password, cb) {
	assert(typeof username === 'string');
	assert(typeof password === 'string');
	assert(typeof cb === 'function');

	var self = this;
	var encrypted = md5(password);

	this.findUser(username, function(err, isFound) {
		if (err) return cb(err);
		else {
			if (!isFound) {
				var input = username + self.separator + encrypted + endOfLine;
				fs.appendFile(htpasswdFile, input, function(err) {
					if (err) return cb(err);
					return cb(err, true);
				});
			} else {
				err = new Error('User with username "' + username + '" exists');
				return cb(err);
			}
		}
	});
};

/**
 * Update username.
 * @param {String} username 
 * @param {String} newName 
 * @param {Function} cb 
 */
User.prototype.updateUsername = function(old, newName, cb) {
	assert(typeof old === 'string');
	assert(typeof newName === 'string');
	assert(typeof cb === 'function');

	var self = this;

	this.findUser(old, function(err, isFound) {
		if (err) return cb(err);
		else {
			if (isFound) {
				self.getPassword(old, function(err, password) {
					if (err) return cb(err);
					if (password) {
						self.removeUser(old, function(err, removed) {
							if (err) return cb(err);
							if (removed) {
								var input = newName + self.separator + password + endOfLine;
								fs.appendFile(htpasswdFile, input, function(err) {
									if (err) return cb(err);
									return cb(err, true);
								});
							} else {
								err = new Error('Could not remove user "' + old + '"');
								return cb(err);
							}
						});
					} else {
						err = new Error('Could not fetch password for "' + old + '"');
						return cb(err);
					}
				});
			} else {
				err = new Error('User with username "' + old + '" exists');
				return cb(err);
			}
		}
	});
};

/**
 * Update password.
 * @param {String} old 
 * @param {String} newPass 
 * @param {Function} cb 
 */
User.prototype.updatePassword = function(old, newPass, cb) {
	assert(typeof old === 'string');
	assert(typeof newPass === 'string');
	assert(typeof cb === 'function');

	var self = this;

	this.findUser(old, function(err, isFound) {
		if (err) return cb(err);
		else {
			if (isFound) {
				self.getPassword(old, function(err, password) {
					if (err) return cb(err);
					if (password) {
						self.removeUser(old, function(err, removed) {
							if (err) return cb(err);
							if (removed) {
								var encrypted = md5(newPass);
								var input = old + self.separator + encrypted + endOfLine;
								fs.appendFile(htpasswdFile, input, function(err) {
									if (err) return cb(err);
									return cb(err, true);
								});
							} else {
								err = new Error('Could not remove user "' + old + '"');
								return cb(err);
							}
						});
					} else {
						err = new Error('Could not fetch password for "' + old + '"');
						return cb(err);
					}
				});
			} else {
				err = new Error('User with username "' + old + '" exists');
				return cb(err);
			}
		}
	});
};

/**
 * Remove an existing user.
 * @param {String} username 
 * @param {Function} cb 
 */
User.prototype.removeUser = function(username, cb) {
	assert(typeof username === 'string');
	assert(typeof cb === 'function');

	var self = this;

	var lines;
	var data = fs.readFileSync(htpasswdFile, 'utf8');
	lines = data.split(endOfLine);
	var datas = '';

	for(var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if(line) {
			var curr_user = line.split(this.separator)[0];
			var curr_password = line.split(this.separator)[1];

			if (curr_user != username) {
				datas += curr_user + self.separator + curr_password + endOfLine;
			}
		}
	}
	fs.writeFile(htpasswdFile, datas, function(err) {
		if (err) return cb(err);
		return cb(err, true);
	});
};


/**
 * Find a user by the username.
 * @param {String} username 
 * @param {Function} cb 
 */
User.prototype.findUser = function(username, cb) {
	assert(typeof username === 'string');
	assert(typeof cb === 'function');

	var lines;
	var user = null;
	var data = fs.readFileSync(htpasswdFile, 'utf8');
	lines = data.split(endOfLine);

	for(var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if(line) {
			if (line.split(this.separator)[0] === username) {
				user = username;
				break;
			}
		}
	}
	return cb(null, user);
};

/**
 * Get password of a username.
 * @param {String} username 
 * @param {Function} cb 
 */
User.prototype.getPassword = function(username, cb) {
	assert(typeof username === 'string');
	assert(typeof cb === 'function');

	var lines;
	var password = null;
	var data = fs.readFileSync(htpasswdFile, 'utf8');
	lines = data.split(endOfLine);

	for(var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if(line) {
			if (line.split(this.separator)[0] === username) {
				password = line.split(this.separator)[1];
				break;
			}
		}
	}
	return cb(null, password);
};

/**
 * Check if a password is correct for the specific user.
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
			user = line.split(this.separator)[0];
			pass = line.split(this.separator)[1].trim();
			if (user === username) {
				found = (pass === md5(password, pass));
				break;
			}
		}
	}
	return found;
};

module.exports = User;
