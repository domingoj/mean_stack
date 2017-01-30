'use strict';

module.exports = (io, app) => {

	let allrooms = app.locals.chatrooms;

	//dummy data for testing
	allrooms.push({
		room: 'Good Food',
		roomID: '0001',
		users: []
	});

	allrooms.push({
		room: 'Travel',
		roomID: '0002',
		users: []
	});

	io.of('/roomslist').on('connection', socket => {
		
		//listen for getChatrooms event
		socket.on('getChatrooms', () => {

			//emit a chatRoomsList event along with the roomslist data
			socket.emit('chatRoomsList', JSON.stringify(allrooms));
		});
	});

}