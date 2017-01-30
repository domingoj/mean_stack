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

}