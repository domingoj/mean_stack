'use strict';
 const passport = require('passport');
 const config = require('../config');
 
 //import the constructor function of passport facebook strategy
 const FacebookStrategy = require('passport-facebook').Strategy;

 module.exports = () => 

 	let authProcessor = (accessToken, refreshToken, profile, done) => {
 		//Find a user profile in the local db using profile.id as sent by 3rt party provider
 		//if the user is found, return the user data using the done() function
 		//if not found, create one in the local db and return
 	}
 	//config and callback
 	passport.use(new FacebookStrategy(config.fb), authProcessor);
 }