'use strict';

var md5 = require('apache-md5');
var fs = require('fs');
var path = require('path');
var endOfLine = require('os').EOL;

// this file path can be pointed to any server located file or local file for htpasswd to work
// for security reasons, all htpasswd should be bycrypted
var htpasswdFile = path.resolve(__dirname, '..', '.private', '.htpasswd');

var User = function() {};

/**
 * Find a user by the username.
 * @param {String} username
 * @param {Function} cb
 */
User.prototype.findUser = function(username, cb) {
  var lines;
  var user = null;
  var data = fs.readFileSync(htpasswdFile, 'utf8');
  lines = data.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line) {
      if (line.split(':')[0] === username) {
        user = username;
        break;
      }
    }
  }
  return cb(null, user);
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
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line) {
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

module.exports = User;
