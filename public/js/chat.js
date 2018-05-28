let socket = io();

socket.on('connect', function(){
    // Gets params from query string and converts to js object
    let params = $.deparam(window.location.search);

    // Check if room was selected from list
    if(params.room !== 'default' && params.room !== 'test' && params.room !== 'misc'){
        return window.location.href = '/';
    }

    socket.emit('join', params, function(err){
        console.log('conn');
        if(err){
            alert(err);
            window.location.href = '/';
        }else{
            console.log('No error');
        }
    });

});

socket.on('disconnect', function(){
    console.log('Disconnected to server');
});

// Updates list of users connected to the room
socket.on('updateUserList', function(users){
    let ol = $('<ol></ol>');

    users.forEach(function(user){
        ol.append($('<li></li>').text(user));
    });

    $('#users').html(ol);
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
    scrollToBottom();

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
    scrollToBottom();
})

$('#message-form').on('submit', function(e){
    // Prevent form submit
    e.preventDefault();

    let messageTextbox = $('[name=message]');

    // Send data to server
    socket.emit('createMessage', {
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

    locationButton.attr('disabled', 'disabled').text('Sending...'); /* disables button after clicking */

    navigator.geolocation.getCurrentPosition(function(position){
        
        locationButton.removeAttr('disabled').text('Send location'); /* removes disabled after delivering message */

        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function(){
        locationButton.removeAttr('disabled').text('Send location'); /* removes disable if not able to deliver message */ 

        alert('Unable to fetch location');
    })
})


function scrollToBottom(){
    // Selectors
    let  messages = $('#messages');
    let newMessage = messages.children('li:last-child');

    // Heights
    let clientHeigh = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeigh + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}