let socket = io();

socket.on('connect', function(){
    console.log('Connected to server');
});

socket.on('disconnect', function(){
    console.log('Disconnected to server');
});

socket.on('newMessage', function(message){
    document.getElementById('messageBox').innerHTML = message.text;
});
