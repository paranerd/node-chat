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

	let config = {
		bufferSize: 2048
	}
	let streamer = new Streamer(config, socket);
	let player = new Player(config, socket);

	$("#listen").on('click', function() {
		if (player.isPlaying()) {
			$(this).find('i').removeClass("fa-volume-up").addClass("fa-volume-mute");
			player.stop();
		}
		else {
			$(this).find('i').removeClass("fa-volume-mute").addClass("fa-volume-up");
			player.play();
		}
	});

	$("#record").on('click', function() {
		if (streamer.isRecording()) {
			$(this).find('i').removeClass("fa-microphone-alt").addClass("fa-microphone-alt-slash");
			streamer.stop();
		}
		else {
			$(this).find('i').removeClass("fa-microphone-alt-slash").addClass("fa-microphone-alt");
			streamer.record();
		}
	});
});

function addMessage(msg, username, type) {
	username = (type == 'own') ? "" : username;
	$("#messages").append($('<li class="' + type + '">').append($('<div>').append($('<span class="msg-user">').text(username)).append($('<span class="msg-text">').text(msg)).append($('<span class="msg-time">').text(getTime()))));
	$("#messages").animate({scrollTop: $("#messages").prop('scrollHeight')});
}

function getTime() {
	let d = new Date();
	let hours = d.getHours();
	let minutes = d.getMinutes();

	// Pad with zeros
	hours = (hours <= 9) ? "0" + hours : hours;
	minutes = (minutes <= 9) ? "0" + minutes : minutes;
	return hours + ":" + minutes;
}
