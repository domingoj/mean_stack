'use strict';

if(process.env.NODE_ENV === 'production'){
	//offer prod stage env variables
	module.exports = {
		host: process.env.host || "",
		dbURI: process.env.dbURI,
		sessionSecret: process.env.sessionSecret
	}
} else {
	//offer dev stage settings and data
	module.exports = require('./development.json');
}