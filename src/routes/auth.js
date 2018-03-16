'use strict';

module.exports = function(app, passport, fns) {
	// login page route
	app.get('/login', function(req, res) {
		res.render('login', { message: req.flash('loginMessage'), title: 'Login', 
			user: null, 
			role: null,
			showfilter: true,
			review: false
		});
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/roles', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// logout page route
	app.get('/logout', fns, function(req, res) {
		req.session.destroy(function () {
			res.redirect('/');
		});
	});
};
