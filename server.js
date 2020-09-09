const express = require('express')
const fs = require('fs');
const compression = require('compression');
const bodyParser = require('body-parser');
const hbs  = require('express-hbs');
const https = require('https');

const privateKey = fs.readFileSync('config/server.key', 'utf8');
const certificate = fs.readFileSync('config/server.crt', 'utf8');

const app = express();
const httpsServer = https.createServer({key: privateKey, cert: certificate}, app);

const io = require('socket.io')(httpsServer);
const ioSession = require("express-socket.io-session");
const db = require('./config/database');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session')({
	secret: 'mylittlesecret',
	resave: true,
	saveUninitialized: true
});

const port = 8088;

app.use(compression({filter: shouldCompress}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Include assets
app.use(express.static(__dirname + '/public'));

// Setup template engine
app.engine('hbs', hbs.express4({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// Setup passport
require('./config/passport')(passport);
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Include controllers
app.use(require('./controllers'));

// Setup sockets-io
io.use(ioSession(session, {
	autoSave: true
}));

io.on('connection', function(socket) {
	console.log(socket.handshake.session.username + " (" + socket.id + ") connected");

	// Tell everyone who joined
	socket.broadcast.emit('broadcast', socket.handshake.session.username + ' connected');

	// Greet new user
	socket.emit('system', 'hello ' + socket.handshake.session.username);

	socket.on('disconnect', function() {
		console.log(socket.handshake.session.username + ' disconnected');
		socket.broadcast.emit('broadcast', socket.handshake.session.username + ' disconnected');
		delete socket.handshake.session.username;
	});

	socket.on('chat message', function(msg) {
		socket.broadcast.emit('chat message', {username: socket.handshake.session.username, msg: msg});
	});

	socket.on('sound', function(msg) {
		socket.broadcast.emit('sound', {chunk: msg.chunk})
	});

	socket.on('start', function(msg) {
		socket.broadcast.emit('chat message', {username: socket.handshake.session.username, msg: 'Streaming...'});
	});

	socket.on('stop', function(msg) {
		socket.broadcast.emit('stop');
	});
});

function shouldCompress(req, res) {
	if (req.headers['x-no-compression']) {
		return false;
	}

	return compression.filter(req, res);
}

// Start server
httpsServer.listen(port, function() {
	console.log('Listening on https://localhost:' + port);
});