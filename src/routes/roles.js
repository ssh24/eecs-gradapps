'use strict';

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
	res.render('roles', { title: 'Please select a role: TBD' });
});

module.exports = router;
