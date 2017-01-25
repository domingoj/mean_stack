'use strict';
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('../config');
const db = require('../db');

if(process.env.NODE_ENV === 'production'){
	// Initialize session with settings for production
	//Initialize session with settings for dev
	module.exports = session({
		secret: config.sessionSecret,
		//if true, will resave the session everytime even when session is not changed
		resave: false,
		//session will be no initialized if without no data
		saveUnitilialized: false,
		//where to store data
		store: new MongoStore({
			mongooseConnection: db.Mongoose.connection
		})
	});

} else {
	//Initialize session with settings for dev
	module.exports = session({
		secret: config.sessionSecret,
		//if true, will resave the session everytime even when session is not changed
		resave: false,
		//session will be initialized even without no data
		saveUnitilialized: true
	});


}