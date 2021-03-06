'use strict';
 const passport = require('passport');
 const config = require('../config');
 const logger = require('../logger');
 const db = require('../db');
 
 //import the constructor function of passport facebook strategy
 const FacebookStrategy = require('passport-facebook').Strategy;
 const TwitterStrategy = require('passport-twitter').Strategy;
//FInd a single user based on a key
let findOne = profileID => {
	console.log("findOne");
	return db.userModel.findOne({
		'profileId': profileID
	});
}

//Create a new user and return that instance
let createNewUser = profile => {
	return new Promise((resolve, reject) => {
		let newChatUser = new db.userModel({
			profileId: profile.id,
			fullName: profile.displayName,
			profilePic: profile.photos[0].value || ''
		});

		newChatUser.save(error => {
			if(error){
				reject(error);
			} else {
				resolve(newChatUser);
			}
		})
	});
}

let findById = id => {
	console.log("findbyid");
	return new Promise((resolve, reject) => {

		db.userModel.findById(id, (error, user) => {

			if(error){
				reject(error);
			} else {
				resolve(user);
			}
		});
	});
}

 module.exports = () => {

 	//will be invoked once done() with authentication
 	passport.serializeUser((user, done) => {
 		console.log("serialize");
 		//create a session and store user.id (mongodb unique id) on that session
 		done(null, user.id);
 	});

 	//whenever a request for the user data is received,
 	//passport fetches the user.id from the session and invokes this method
 	passport.deserializeUser((id, done) => {
 		console.log("deserialize");
 		//Find the user using the _id
 		findById(id)
 			.then(user => done(null, user))
 			.catch(error => logger.log('error', 'Error when deserializing the user: ' + error));

 	});

 	//for twitter (OAuth 1.0):
 	//accessToken -> token
 	//refreshToken -> tokenSecret
 	let authProcessor = (accessToken, refreshToken, profile, done) => {
 		//Find a user profile in the local db using profile.id as sent by 3rt party provider
 		console.log("authprocessor");
 		findOne(profile.id)
 			//if the user is found, return the user data using the done() function
 			.then(result => {
 				if(result){
 					done(null, result);
 				} else {
 					//if not found, create one in the local db and return
 					createNewUser(profile)
 						.then(newChatUser => done(null, newChatUser))
 						.catch(error => logger.log('error','Error when creating a user: ' + error));
 				}
 			})
 	}
 	//config and callback
 	console.log("strategy");
 	passport.use(new FacebookStrategy(config.fb, authProcessor));
 	passport.use(new TwitterStrategy(config.twitter, authProcessor));

 }


