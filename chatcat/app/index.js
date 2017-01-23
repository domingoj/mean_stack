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


module.exports = {
	router: router
}