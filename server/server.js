// DEPENDENCIES IMPORTS
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

// LOCAL IMPORTS
const {generateMessage, generateLocationMessage} = require('./utils/message'); /* Generates message object to send to user */
const {isRealString} = require('./utils/validation');
const {Users} = require = require('./utils/users');

// CONFIG
const publicPath = path.join(__dirname, '../public'); /* Sets public files folder path */
const PORT = process.env.PORT || 3000;

const app = express(); /* Creates express app */
const server = http.createServer(app);
const io = socketIO(server); /* websockets server */
const users = new Users();

// MIDDLEWARE
app.use(express.static(publicPath)); /* Sets public files folder */

// EVENT REGISTRATION
io.on('connection', (socket) => {
    console.log('New user connected');

    // Setting up a room
    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room name are required');
        }
        
        socket.join(params.room);
        // socket.leave(params.room); -> removes user from room

            // io.emit -> emits to every connected user
            // socket.broadcast.emit -> emits to everyone except current user
            // socket.emit -> emits to one user only

            // io.to('Room name').emit -> emits to every connected user in a room
            // socket.broadcast.to('Room name').emit -> emits to everyone except current user in a room

        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        // Server messages
            // Greeting for a new user
            socket.emit('newMessage', generateMessage('Admin', `Welcome to room - ${params.room}`));
            // Informing other users about new user / socket connection
            socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        callback();
    });

    // Basic user message
    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);

        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text)) /* io.emits emits to every connection */
            callback();
            // socket.broadcast.emit('newMessage', message); /* emits to everyone but the calling socket */
        }
    })

    // User location message
    socket.on('createLocationMessage', (position) => {
        let user = users.getUser(socket.id);

        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, position.latitude, position.longitude));
        }
    });

    // Informing other users that a user has left
    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }

    });
});

// ROUTES
server.listen(PORT, () => {
    console.log(`Server started at ${PORT}`)
});