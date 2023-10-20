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
  const defaultName = generateNewUsername();
  socket.name = defaultName;
  onlineUsers.set(socket.name, socket.id);
  updateOnlineUsers();

  // Emit a welcome message to the user
  socket.emit('welcome', `Welcome to the chat, ${socket.name}!`);

  // Emit default name to the user
  socket.emit('name', defaultName);

  // Broadcast a user's connection to others
  socket.broadcast.emit('chat', `${socket.name} connected to the chat`);

  // Handle chat messages
  socket.on('chat', (msg) => {
    io.emit('chat', `${socket.name}: ${msg}`);
  });

  // Change user name
socket.on('changeName', (newName) => {
  if (!onlineUsers.has(newName)) {
    const oldName = socket.name;
	onlineUsers.delete(socket.name);
    socket.name = newName;
    onlineUsers.set(newName, socket.id);
    updateOnlineUsers();
    io.emit('name', newName);
    io.emit('chat', `${oldName} changed their name to ${newName}`);
  } 
  else {
    socket.emit('chat', `Could not change name, ${newName} is already in use`);
  }
});

  socket.on('disconnect', () => {
    const disconnectedUserName = socket.name;
    onlineUsers.delete(disconnectedUserName); 
    updateOnlineUsers(); 
    io.emit('chat', `${disconnectedUserName} has left the chat`);
  });
});

// Update the count of online users and notify all clients
function updateOnlineUsers() {
  io.emit('online', onlineUsers.size);
}

// Function to generate random username
function generateNewUsername() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return `User_${randomString}`;
}

// Server start listening
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});