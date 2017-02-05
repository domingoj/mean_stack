'use strict';
const crypto = require('crypto');

module.exports = (io, app) => {

	let allrooms = app.locals.chatrooms;

	let findRoomByName = (allrooms, room) => {
				let findRoom = allrooms.findIndex((element, index, array) => {
				
					if(element.room === room) {
						return true;
					} else {
					return false;
					}

				});

				return findRoom > -1 ? true : false;
			}

	//Find a chatroom with a given ID
	//DUPLICATED BECAUSE I DIDN'T CREATE THE HELPER MODULE
	//SIMPLE STUFF, TOO LAZY TO DO
	let findRoomById = (allrooms, roomID) => {
	return allrooms.find((element, index, array) => {

			if(element.roomID === roomID){
				return true;
			} else {
				return false;
			}
		})
	}

	let addUserToRoom = (allrooms, data, socket) => {

		//get the room object
		let getRoom = findRoomById(allrooms, data.roomID);
	
		if(getRoom !== undefined){
			//get the active user's ID
			let userID = socket.request.session.passport.user;

			//Check to see if this user already exists
			let checkUser = getRoom.users.findIndex((element, index, array) => {

				if(element.userID === userID){
					return true;
				} else {
					return false;
				}
			});

			//if the user is already present in the room, remove his first
			if (checkUser > -1) {
				getRoom.users.splice(checkUser, 1);
			}

			//push the user into the room's user array
			getRoom.users.push({
				socketID: socket.id,
				userID,
				user: data.user,
				userPic: data.userPic
			});

			// join the room channel
			socket.join(data.roomID);

			//return the updated room object
			return getRoom;

		}
	}

	let removeUserFromRoom = (allrooms, socket) => {
		
		for(let room of allrooms){
			//find the user
			let findUser = room.users.findIndex((element, index, array) => {
				if(element.socketID === socket.id){
					return true;
				} else {
					return false;
				}

				//return element.socketID === socket.id ? true: false;
			});

			if(findUser > -1) {
				socket.leave(room.roomID);
				room.users.splice(findUser, 1);
				return room;
			}
		}
	}

	//unique roomID generator
	let randomHex = () => {
		return crypto.randomBytes(24).toString('hex');
	}


	io.of('/roomslist').on('connection', socket => {
		
		//listen for getChatrooms event
		socket.on('getChatrooms', () => {

			//emit a chatRoomsList event along with the roomslist data
			socket.emit('chatRoomsList', JSON.stringify(allrooms));
		});

		socket.on('createNewRoom', newRoomInput => {

			// check to see if a room with the same title exists or not
			// if not, create one and broadcast it to everyone
			if(!findRoomByName(allrooms, newRoomInput)){


				allrooms.push({
					room: newRoomInput,
					roomID: randomHex(),
					users: []
				});

				//Emit an updated list to the creator
				socket.emit('chatRoomsList', JSON.stringify(allrooms));
				//Emit an updated list to everyone else on the rooms page
				socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));
			}

		});
	});

	io.of('/chatter').on('connection', socket => {

		//Join a chatroom
		socket.on('join', data => {

			let usersList = addUserToRoom(allrooms, data, socket);

			// Update the list of active users as shown in the chatroom
			socket.broadcast.to(data.roomID).emit('updateUsersList', JSON.stringify(usersList.users));
			socket.emit('updateUsersList', JSON.stringify(usersList.users));
		});

		//when a socket exists
		socket.on('disconnect', () => {

			//find the room, and purge the user
			let room = removeUserFromRoom(allrooms, socket);
			socket.broadcast.to(room.roomID).emit('updateUsersList', JSON.stringify(room.users));
		})

	});

}