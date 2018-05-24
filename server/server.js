// DEPENDENCIES IMPORTS
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

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

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('createMessage', (message) => {
        io.emit('newMessage', message) /* io.emits emits to every connection */
    })
});

// ROUTES
server.listen(PORT, () => {
    console.log(`Server started at ${PORT}`)
});