'use strict';

var db = require('./db-type');

module.exports = {
	'host': process.env.MYSQL_HOST,
	'port': process.env.MYSQL_PORT,
	'user': process.env.MYSQL_USER,
	'password': process.env.MYSQL_PASSWORD,
	'database': process.env.NODE_ENV === 'test' ? db.test : db.app,
	'multipleStatements': true
};
