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
var rooms = {};
var roomDatas = {};


var socket;
var minRoom = 20000;
var maxRoom = 100000;


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
		rooms[i] = 0;
		// console.log("Room: " + i + " created!");
	}
}

io.on('connection', function(socket){
	connector++;
	console.log("socket connecting: " + socket.id);
	// onSocketConnecting(socket);

	socket.on('disconnect', (reason) => {
		console.log("some one disconnect!");

	});
});


const maxPlayer = 4;

// function join(socket, room){
// 			socket.join(room, function(){
// 			joinedRoom = room;
// 			rooms[room]++;
// 			socket.emit("joinRoom", {roomId: room});
// 			console.log("socket is joined room: " + room)
// 			console.log("total player in " + room +  " is: " + rooms[room]);

// 			if(rooms[room] == maxPlayer){
// 				//start game
// 				console.log("room " + room + " starting game!");
// 				socket.emit("startGame");

// 			}
// 		});
// }

// function joinRoom(socket, room){

// 		// var cr = io.sockets.clients(room);
// 		// if(typeof cr === "undefined"){
// 		if(rooms[room] <= 0){
// 			//no room, just join.
// 			console.log("no player, just join this room and own it!");
// 			join(socket, room);

// 			// var cr =  io.sockets.clients(room);

// 		}
// 		else{
// 		if(rooms[room] < maxPlayer){
// 			console.log("lenme join the party!");
// 			join(socket, room);
// 		}
// 		else{
// 			socket.emit("roomFull");
// 			console.log("room: " + room + " is full!");
// 		}
// 	}


// }

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



