let socket = io();

socket.on('connect', function(){
    console.log('Connected to server');
});

socket.on('disconnect', function(){
    console.log('Disconnected to server');
});

socket.on('newMessage', function(message){
    // Setup timestamp
    let formattedTime = moment(message.createdAt).format('HH:MM:SS');

    // Setup template
    let template = $('#message-template').html();
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    // Append template
    $('#messages').append(html);

});

socket.on('newLocationMessage', function(message){
    // Setup timestamp
    let formattedTime = moment(message.createdAt).format('HH:MM:SS');

    // Setup template
    let template = $('#location-message-template').html();
    let html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });

    // Append template
    $('#messages').append(html);
})

$('#message-form').on('submit', function(e){
    // Prevent form submit
    e.preventDefault();

    let messageTextbox = $('[name=message]');

    // Send data to server
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function(){
        messageTextbox.val('');
    })
})

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

let locationButton = $('#send-location');

locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }

    locationButton.attr('disabled', 'disabled').text('Sending...'); /* disables button */

    navigator.geolocation.getCurrentPosition(function(position){
        
        locationButton.removeAttr('disabled').text('Send location');

        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function(){
        locationButton.removeAttr('disabled').text('Send location');

        alert('Unable to fetch location');
    })


})