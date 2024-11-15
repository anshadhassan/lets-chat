import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import path from 'path';

// Setup __dirname for ES Module (since __dirname is not available in ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Store connected users and their IDs
const users = {};

app.use(express.static(path.join(__dirname, 'front-end')));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end', 'index.html'));
});

// Handle new connections and assign unique ID
io.on('connection', (socket) => {
  console.log('a user connected: ' + socket.id);
  
  // Listen for new user login (with a username)
  socket.on('setUsername', (username) => {
    users[socket.id] = username;  // Assign username to socket ID
    console.log(`${username} has connected`);

    // Notify the user with their username
    socket.emit('userConnected', `You are connected as ${username}`);
  });

  // Handle private messages
  socket.on('privateMessage', (data) => {
    const { toUsername, message } = data;
    
    // Find the socket ID of the recipient
    const recipientSocketId = Object.keys(users).find(key => users[key] === toUsername);
    
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('privateMessage', {
        from: users[socket.id],
        message
      });
    } else {
      socket.emit('error', 'User not found!');
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`${users[socket.id]} disconnected`);
    delete users[socket.id];  // Remove user from list on disconnect
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});