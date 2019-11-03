'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT,  "0.0.0.0", () => console.log(`Listening on ${ PORT }`));


  const io = socketIO(server);


// setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

var connector = 0;
var startFunction = setInterval(initRoom, 100);
// setInterval(update, 10000); //time is in ms
io.attach(4567);

var joinedRoom;
var rooms = [{
interval: '',
id: '', 
isPlaying: false,
isExecuting: false,
scores: [{player: '', score: 0, correct: 0, wrong: 0}],  
datas:[{player: '', slogan: ''}]

}];


var socket;


const minRoom = 20000;
const maxRoom = 100000;
const maxPlayer = 4;

const roundDuration = 5000;
const waitDuration = 3000;






// function update(){
// 	logInfo();
// }

// function logInfo(){
// 	var log = "Player connecting: " + connector;
// 	io.emit('msg', log);
// 	console.log(log);
// }



function initRoom(){
	clearInterval(startFunction);

	for(var i = minRoom; i < maxRoom; i++){
		rooms[i] =  {};
		
		ResetRoom(i);
		// console.log(rooms[i].datas);

		console.log("Room: " + i + " created!");
	}
}

io.on('connection', function(socket){
	connector++;
	console.log("socket connecting: " + socket.id);



	socket.on("joinRoom", function(roomId){
		console.log("received event from socket: " + socket.id);
		joinRoom(socket, roomId);
	});

	// onSocketConnecting(socket);
	socket.on('disconnect', (reason) => {
		console.log("some one disconnect!");
	});


});



function join(socket, room){
			socket.join(room, function(){
			joinedRoom = room;
			rooms[room]++;
			socket.emit("joinRoom", {roomId: room});
			console.log("socket is joined room: " + room)
			console.log("total player in " + room +  " is: " + rooms[room]);

			if(rooms[room] == maxPlayer){
				//start game
				console.log("room " + room + " starting game!");
				socket.emit("startGame");
				rooms[room]['isStart'] = true;
			}
		});
			 
}

function leave(socket, room){
	console.log("some one leave room " + room);
	socket.leave(room);
}

function excecuteGames(){
	for(var i =0; i < rooms.length; i++){
		if(rooms[i]['isPlaying' && !rooms[i].isExecuting]){
			//this room is playing, execute it.
			rooms[i].isExecuting = true;
			UpdateRoom(rooms[i]);
		}
	}

}


function ResetRoom(i){
	rooms[i].id = i;
	rooms[i].isPlaying = false;
	rooms[i].isExecuting = false;
	rooms[i].datas = [];
	rooms[i].scores = [];
}
function UpdateRoom(room){
	rooms[room.id].interval = room.setInterval(roundDuration, function(){
		//pop data room
		var data = room.datas.pop();
		io.to(room.id).emit('onGameUpdate', room);
		if(datas.length <= 0)
		{
			// clearInterval(rooms[room.id].interval);
			//complete game, clear room data and status, kick all players.
			io.to(room.id).emit('onGameCompleted', room);
			ResetRoom(room.id);
		}
		else{
			UpdateRoom(room);
		}
	});
}

function joinRoom(socket, room){

		// var cr = io.sockets.clients(room);
		// if(typeof cr === "undefined"){
		if(rooms[room] <= 0){
			//no room, just join.
			console.log("no player, just join this room and own it!");
			join(socket, room);

			// var cr =  io.sockets.clients(room);

		}
		else{
		if(rooms[room] < maxPlayer){
			console.log("lenme join the party!");
			join(socket, room);
		}
		else{
			socket.emit("roomFull");
			console.log("room: " + room + " is full!");
		}
	}


}

// function getRandomRoom(){
// 	var r = Math.random();
// 		var min = minRoom;
// 		var max = maxRoom;
// 		var factor = ((1 - r) * min) + (r * max);

// 		return  Math.floor(factor);
// }

// function createRoom(socket){
// 	console.log("Creating new room...");
// 		var room = getRandomRoom();

// 		if(rooms[room] >= 1){
// 			console.log("room exist, create other room!");
// 			createRoom();	
// 			return;

// 		}
// 		// var crom =  io.sockets.clients(room);
// 		// if(typeof crom !== "undefined"){
// 		// //room exist, create another one.
// 		// 	createRoom();
// 		// 	return;
// 		// }
// 		joinRoom(socket, room);

// }

// function onSocketConnecting(socket){
// 	socket.on('createRoom', function(){
// 		createRoom(socket);
// 	});

// 	socket.on('disconnect', (reason) => {
// 		console.log("some one disconnect!");
// 	connector--;
// 	socket.emit("exitRoom");
// 	var rd = roomDatas[socket.id] 
// 	if(typeof rd !== "undefined"){
// 		//disconnect from room
// 		joinedRoom = "undefined";
// 		rooms[rd]--;
// 		console.log("Some one leave room " + rd + " reason: " + reason);
// 		console.log("total player in " + rd +  " is: " + rooms[rd]);
// 	}
	 
// 	});

// 	socket.on("joinRoom", function(roomId){
// 		console.log("received event from socket: " + socket.id);
// 		roomDatas[socket.id] = roomId;
// 		joinRoom(socket, roomId);
// 	});

// }



