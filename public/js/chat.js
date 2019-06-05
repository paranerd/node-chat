$(function() {
	var username = $('head').data('username')
	var socket = io();

	$('form').submit(function(){
		socket.emit('chat message', $('#msg').val());
		addMessage($("#msg").val(), username, 'own');
		$('#msg').val('');
		return false;
	});

	socket.on('system', function (msg) {
		addMessage(msg, "System", 'system');
	});

	socket.on('broadcast', function (msg) {
		addMessage(msg, "System", 'broadcast');
	});

	socket.on('chat message', function(msg) {
		addMessage(msg.msg, msg.username);
	});
});

function addMessage(msg, username, type) {
	username = (type == 'own') ? "" : username;
	$("#messages").append($('<li class="' + type + '">').append($('<div>').append($('<span class="msg-user">').text(username)).append($('<span class="msg-text">').text(msg)).append($('<span class="msg-time">').text(getTime()))));
	$("#messages").animate({scrollTop: $("#messages").prop('scrollHeight')});
}

function getTime() {
	var d = new Date();
	return d.getHours() + ":" + d.getMinutes();
}
