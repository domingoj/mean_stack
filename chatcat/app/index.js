'use strict';
const router = require('express').Router();
const passport = require('passport');
const config = require('./config');
const redis = require('redis').createClient;
const adapter = require('socket.io-redis');
// Social Authentication logic
require('./auth')();

//Create an IO Server instance
let ioServer = app => {

	//stored in memory, not in db
	app.locals.chatrooms = [];

	const server = require('http').Server(app);
	const io = require('socket.io')(server);

	//for session affinity support, use websocket
	//needs to update on the views too
	io.set('transports', ['websocket']);

	//intereface for sending and publishing data buffers
	let pubClient = redis(config.redis.port, config.redis.host, {
		auth_pass: config.redis.password
	});

	//interface to subscribe or get data back from redis
	let subClient = redis(config.redis.port, config.redis.host, {
		return_buffers: true,
		auth_pass: config.redis.password
	});

	//to interface redis with socket.io
	io.adapter(adapter({
		pubClient,
		subClient
	}));

	//socket.io middleware
	io.use((socket, next) => {

		//for socket.io to read directly from the session
		require('./session')(socket.request, {}, next);
	});

	require('./socket')(io, app);
	return server;
}

//Find a chatroom with a given ID
let findRoomById = (allrooms, roomID) => {
	return allrooms.find((element, index, array) => {

		if(element.roomID === roomID){
			return true;
		} else {
			return false;
		}
	})
}


router.get('/', (req, res, next) => {
	
	res.render('login', {
		pageTitle: 'My Login Page'
	});
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


// A middle ware that checks to see if the user is authenticated & logged in
let isAuthenticated = (req, res, next) => {

	//method provided by passport
	if(req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/');
	}

}


router.get('/logout', (req, res, next) => {
	
	//method available thru passport to clear out a session
	req.logout();
	res.redirect('/');

});


router.use(isAuthenticated);

router.get('/rooms', (req, res, next) => {

	res.render('rooms', {
		user: req.user,
		host: config.host
	});

});

router.get('/chat/:id', (req, res, next) => {

	//Find a chatroom using the id
	//render if found
	let getRoom = findRoomById(req.app.locals.chatrooms, req.params.id);
	if(getRoom === undefined){
		return next();
	} else {

		res.render('chatroom', {
			user: req.user,
			host: config.host,
			room: getRoom.room,
			roomID: getRoom.roomID

		});

	}

});

module.exports = {
	router,
	session: require('./session'),
	ioServer,
	logger: require('./logger')
}