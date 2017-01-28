'use strict';
const router = require('express').Router();
const passport = require('passport');

require('./auth')();

router.get('/', (req, res, next) => {
	
	res.render('login', {
		pageTitle: 'My Login Page'
	});
});


router.get('/rooms', (req, res, next) => {

	res.render('rooms', {
		user: req.user
	});

});

router.get('/chat', (req, res, next) => {

	res.render('chatroom');

});

router.get('/getsession', (req, res, next) => {

	res.send("My favorite color: "  + req.session.favColor);
});

router.get('/setsession', (req, res, next) => {

	req.session.favColor = "Red";

	res.send("Session set");
});

//Routing for auth 
router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/rooms',
		failureRedirect: '/login'
	})

);

//Routing for auth 
router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
		successRedirect: '/rooms',
		failureRedirect: '/login'
	})

);

module.exports = {
	router: router,
	session: require('./session')
}