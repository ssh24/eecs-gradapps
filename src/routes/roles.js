var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('roles', { title: 'Role Selection'});
});

/* GET Admin Page */
router.get('/admin', function(req,res, next){
    res.render('admin', { title: 'Administrator'});
})

module.exports = router;
