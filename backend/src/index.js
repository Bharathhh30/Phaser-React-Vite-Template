const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (adjust for security)
  },
});

let players = {}; // Store connected players' positions , simply storing players

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send existing players to the new player
  socket.emit('currentPlayers', players);

  // default position for spawning new users
  players[socket.id] = { x: 400, y: 300 }
  socket.broadcast.emit('newPlayer', { id: socket.id, x: 400, y: 300 });


  // When a new player joins, add them
  // socket.on('newPlayer', (player) => {
  //   players[socket.id] = player;
  //   io.emit('playerJoined', { id: socket.id, player });
  // });
  // commented above lines to reduce the redundancy of code

  // When a player moves, update position and broadcast it
  socket.on('playerMoved', (movementData) => {
    if (players[socket.id]) {
      players[socket.id] = movementData;
      socket.broadcast.emit('playerMoved', { id: socket.id, ...movementData });
    }
  });

  // When a player disconnects, remove them
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    delete players[socket.id];
    io.emit('playerDisconnected', socket.id);
  });
});

app.get('/',(req,res)=>{
    res.send("Server running")
})

server.listen(6969, () => {
  console.log('Server running on port 6969');
});
