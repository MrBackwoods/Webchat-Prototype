const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 8080;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Store online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  // Handle new user connections
  const defaultName = `User${Math.floor(Math.random() * 1000) + 1}`;
  socket.name = defaultName;
  onlineUsers.set(socket.id, socket.name);
  updateOnlineUsers();

  // Emit a welcome message to the user
  socket.emit('welcome', `Welcome to the chat, ${socket.name}!`);

  // Emit default name to the user
  socket.emit('name', defaultName);

  // Broadcast a user's connection to others
  socket.broadcast.emit('chat', `${socket.name} connected to the chat.`);

  // Handle chat messages
  socket.on('chat', (msg) => {
    io.emit('chat', `${socket.name}: ${msg}`);
  });

  // Change user name
  socket.on('changeName', (newName) => {
    const oldName = socket.name;
    socket.name = newName;
    onlineUsers.set(socket.id, newName);
    updateOnlineUsers();
	io.emit('name', newName);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    const disconnectedUser = onlineUsers.get(socket.id);
    onlineUsers.delete(socket.id);
    updateOnlineUsers();
    io.emit('chat', `${disconnectedUser} disconnected.`);
  });
});

// Update the count of online users and notify all clients
function updateOnlineUsers() {
  io.emit('online', onlineUsers.size);
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});