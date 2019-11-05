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
round: 0,
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



	socket.on("joinRoom", function(roomData){
		console.log("received event from socket: " + socket.id);
		joinRoom(socket, roomData);
	});

	// onSocketConnecting(socket);
	socket.on('disconnect', (reason) => {
		console.log("some one disconnect!");
	});


});



function join(socket, room){
			socket.join(room['id'], function(){
			joinedRoom = room['id'];
			rooms[room['id']]++;
			rooms[room['id']].datas.push(room['datas']);	

			socket.emit("joinRoom", {roomId: room});
			console.log("socket is joined room: " + room['id'])
			console.log("total player in " + room['id'] +  " is: " + rooms[room['id']]);
			if(rooms[room['id']] == maxPlayer){
				//start game
				console.log("room " + room['id'] + " starting game!");
				//shuffling data before starting game.
				var newDatas = [];
				var datasCopy = rooms[room['id']].datas;
				rooms.datas = [];

				for(var s = 0; s < rooms[room['id']].datas.length; s++){
					var r = Math.floor((Math.random() * datasCopy.length));
					var it = datasCopy[r];
					rooms.data[s] = it;
					datasCopy.splice(r, 1);
					console.log("data: " + it);
				}
				socket.emit("startGame");
				rooms[room['id']]['isStart'] = true;
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
	rooms[i].round = 0;
	rooms[i].id = i;
	rooms[i].isPlaying = false;
	rooms[i].isExecuting = false;
	rooms[i].datas = [];
	rooms[i].scores = [];
}
function UpdateRoom(room){
	rooms[room.id].interval = room.setInterval(roundDuration, function(){
		//pop data from room and update to client.

		var data = room.datas[room.round];

		io.to(room.id).emit('onGameUpdate', room);
		if(room.round >= room.datas.length)
		{
			// clearInterval(rooms[room.id].interval);
			//complete game, clear room data and status, kick all players.
			io.to(room.id).emit('onGameFinished', room);
			ResetRoom(room.id);
		}
		else{
			room.round++;
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



