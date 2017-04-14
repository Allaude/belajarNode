var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var nameUsed = [];
var currentRoom = {};

exports.listen = function(server){
	io = socketio.listen(server);
	io.set('log level', 1);
	io.sockets.on('connection', function(socket){
		guestNumber = assignGuestName(socket,guestNumber,nickNames,nameUsed);
		joinRoom(socket,'Lobby');
		handleMessageBroadcasting(socket,nickNames);
		handleNameChangeAttempts(socket,nickNames,nameUsed);
		handleRoomJoining(socket);

		socket.on('rooms',function(){
			socket.emit('rooms',io.sockets.manager.rooms);
		});

		handleClientDisconnection(socket,nickNames,nameUsed);
	});
}

function assignGuestName(socket,guestNumber,nickNames,nameUsed){
	var name = 'Guest'+guestNumber;
	nickNames[socket.id] = name;
	socket.emit('nameResult',{success : true,name:name});
	nameUsed.push(name);
	return guestNumber + 1;
}
function joinRoom(socket,room){
	socket.join(room);
	currentRoom[socket.id] = room;
	socket.emit('joinResult',{room:room});
	socket.broadcast.to(room).emit('message',{
		text : nickNames[socket.id] + 'has joined' + room + '.'});
	var userInRoom = io.sockets.clients(room);
	if (userInRoom.length > 1){
		var userInRoomSummary = 'Users currently in '+room+': ';
		for (var index in userInRoom){
			var userSocketId = userInRoom[index].id;
			if (userSocketId != socket.id){
				if (index > 0){
					userInRoomSummary += ', ';
				}
				userInRoomSummary += nickNames[userSocketId];
			}
		}
		userInRoomSummary += '.';
		socket.emit('message',{text : userInRoomSummary});
	}
};
function handleNameChangeAttempts(socket,nickNames,nameUsed){
	socket.on('nameAttempt',function(name){
		if (name.indexOf('Guest') == 0){
			socket.emit('nameResult',{
				success : false,
				message : 'name cannot begin with "Guest".'
			});
		} else {
			if (nameUsed.indexOf(name) == -1){
				var previousName = nickNames[socket.id];
				var previousNameIndex = nameUsed.indexOf(previousName);
				nameUsed.push(name);
				nickNames[socket.id] = name;
				delete nameUsed[previousNameIndex];
				socket.emit('nameResult',{
					success : true,
					name : name
				});
				socket.broadcast.to(currentRoom[socket.id]).emit('message',{
					text : previousName + 'is now known as '+name+'.'
				});
			} else {
				socket.emit('nameResult',{
					success : false,
					message : 'That Name is Already to use'
				});
			}
		}
	});
}
function handleMessageBroadcasting(socket){
	socket.on('message',function(message){
		socket.broadcast.to(message.room).emit('message',{
			text : nickNames[socket.id] + ': '+message.text
		});
	});
}
function handleRoomJoining(socket){
	socket.on('join',function(room){
		socket.leave(currentRoom[socket.id]);
		joinRoom(socket,room.newRoom);
	});
}
function handleClientDisconnection(socket){
	socket.on('disconnect',function(){
		var nameIndex = nameUsed.indexOf(nickNames[socket.id]);
		delete nameUsed[nameIndex];
		delete nickNames[socket.id];
	});
}