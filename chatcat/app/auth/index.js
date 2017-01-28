'use strict';
 const passport = require('passport');
 const config = require('../config');
 const db = require('../db');
 
 //import the constructor function of passport facebook strategy
 const FacebookStrategy = require('passport-facebook').Strategy;



//FInd a single user based on a key
let findOne = profileID => {
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

 module.exports = () => 

 	let authProcessor = (accessToken, refreshToken, profile, done) => {
 		//Find a user profile in the local db using profile.id as sent by 3rt party provider
 		
 		findOne(profile.id)
 			//if the user is found, return the user data using the done() function
 			.then(result => {
 				if(result){
 					done(null, result);
 				} else {
 					//if not found, create one in the local db and return
 					createNewUser(profile)
 						.then(newCHatUser => done(null, newCHatUser))
 						.catch(error => console.log('Error when creating a user'));
 				}
 			})
 	}
 	//config and callback
 	passport.use(new FacebookStrategy(config.fb), authProcessor);
 }