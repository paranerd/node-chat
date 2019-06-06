let express = require('express')
let fs = require('fs');
let compression = require('compression');
let bodyParser = require('body-parser');
let hbs  = require('express-hbs');
let https = require('https');

let privateKey = fs.readFileSync('config/server.key', 'utf8');
let certificate = fs.readFileSync('config/server.crt', 'utf8');

let app = express();
let httpsServer = https.createServer({key: privateKey, cert: certificate}, app);

let io = require('socket.io')(httpsServer);
let ioSession = require("express-socket.io-session");
let db = require('./config/database');
let passport = require('passport');
let flash = require('connect-flash');
let session = require('express-session')({
	secret: 'mylittlesecret',
	resave: true,
	saveUninitialized: true
});
let port = 8080;

app.use(compression({filter: shouldCompress}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
	console.log('listening on *:' + port);
});
