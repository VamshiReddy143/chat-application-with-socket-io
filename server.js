const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();  // Initialize an Express app
const server = http.createServer(app);  // Create an HTTP server
const io = socketio(server);  // Initialize Socket.io with the server

// Handle client connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for 'message' event from client
    socket.on('message', ({username,content}) => {
        console.log(`${username}:${content}`);
        io.emit('message', {username,content});  // Send message to all connected clients
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);  // Broadcast typing status to other users
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Serve a simple web page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');  // Serve the frontend HTML file
});

// Start server
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
