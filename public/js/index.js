let socket = io();

socket.on('connect', function(){
    console.log('Connected to server');
});

socket.on('disconnect', function(){
    console.log('Disconnected to server');
});

socket.on('newMessage', function(message){
    let messageBox = document.getElementById('messageBox');

    let messageContainer = document.createElement('p');
    let messageText = document.createTextNode(message.text);

    messageContainer.appendChild(messageText);
    messageBox.appendChild(messageContainer);

});

function sendMessage(){
    // Prevent form submit
    event.preventDefault();

    // Get message data
    let message = {
        from: 'test',
        text: event.target.message.value
    }
    
    // Resent input field
    event.target.message.value = '';

    // Send data to server
    socket.emit('createMessage', message, function(data){
        // console.log(data)
    });
}