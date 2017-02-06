'use strict';

if(process.env.NODE_ENV === 'production'){
	//offer prod stage env variables
	// process.env.REDIS_URL is where REDIS details are
	let redisURI = require('url').parse(process.env.REDIS_URL);
	let redisPassword = redisURL.auth.split(":")[1];
	module.exports = {
		host: process.env.host || "",
		dbURI: process.env.dbURI,
		sessionSecret: process.env.sessionSecret,
		fb: {
			clientID: process.env.fbClientID,
			clientSecret: process.env.fbClientSecret,
			callbackURL: process.env.host + "/auth/facebook/callback",
			profileFields: ["id", "displayName", "photos"]
		},
		twitter: {
			consumerKey: process.env.twConsumerKey,
			consumerSecret: process.env.twConsumerSecret,
			callbackURL: process.env.host + "/twitter/facebook/callback",
			profileFields: ["id", "displayName", "photos"]
		},
		redis: {
			host: redisURI.hostname,
			port: redisURI.port,
			password: redisPassword
		}
	}
} else {
	//offer dev stage settings and data
	module.exports = require('./development.json');
}