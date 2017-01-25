'use strict';
const router = require('express').Router();

router.get('/', (req, res, next) => {
	
	res.render('login', {
		pageTitle: 'My Login Page'
	});
});


router.get('/rooms', (req, res, next) => {

	res.render('rooms');

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

module.exports = {
	router: router,
	session: require('./session')
}