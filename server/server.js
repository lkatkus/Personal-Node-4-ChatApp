// DEPENDENCIES IMPORTS
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

// LOCAL IMPORTS
const {generateMessage, generateLocationMessage} = require('./utils/message'); /* Generates message object to send to user */

// CONFIG
const publicPath = path.join(__dirname, '../public'); /* Sets public files folder path */
const PORT = process.env.PORT || 3000;

const app = express(); /* Creates express app */
const server = http.createServer(app);
const io = socketIO(server); /* websockets server */

// MIDDLEWARE
app.use(express.static(publicPath)); /* Sets public files folder */

// EVENT REGISTRATION
io.on('connection', (socket) => {
    console.log('New user connected');

    // Greeting for a new user
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to best chat ever!'));

    // Informing other users about new user / socket connection
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user has joined!'));

    // Basic user message
    socket.on('createMessage', (message, callback) => {
        io.emit('newMessage', generateMessage(message.from, message.text)) /* io.emits emits to every connection */
        callback();
        // socket.broadcast.emit('newMessage', message); /* emits to everyone but the calling socket */
    })

    // User location message
    socket.on('createLocationMessage', (position) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', position.latitude, position.longitude));
    });

    // Informing other users that a user has left
    socket.on('disconnect', () => {
        socket.broadcast.emit('newMessage', generateMessage('Admin', 'A user has left.'));
    });
});

// ROUTES
server.listen(PORT, () => {
    console.log(`Server started at ${PORT}`)
});