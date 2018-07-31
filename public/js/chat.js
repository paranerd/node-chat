$(function() {
    var socket = io();
    $('form').submit(function(){
        socket.emit('chat message', $('#msg').val());
        addMessage($("#msg").val(), 'own');
        $('#msg').val('');
        return false;
    });

    socket.on('system', function (msg) {
        addMessage(msg, 'system');
    });

    socket.on('broadcast', function (msg) {
        addMessage(msg, 'broadcast');
    });

    socket.on('chat message', function(msg) {
        addMessage(msg);
    });
});

function addMessage(msg, type) {
    $("#messages").append($('<li class="' + type + '">').append($('<div>').append($('<span class="msg-text">').text(msg)).append($('<span class="msg-time">').text(getTime()))));
    $("#messages").animate({scrollTop: $("#messages").prop('scrollHeight')});
}

function getTime() {
    var d = new Date();
    return d.getHours() + ":" + d.getMinutes();
}
