var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('roles', { title: 'Gradapps 2.0', fullpage: 'fullpage' });
});

module.exports = router;
