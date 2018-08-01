var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var hbs  = require('express-hbs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ioSession = require("express-socket.io-session");
var db = require('./config/database');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session')({
    secret: 'mylittlesecret',
    resave: true,
    saveUninitialized: true
});

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
        socket.broadcast.emit('chat message', msg);
        socket.handshake.session.sockettest = 'working';
    });
});

// Start server
http.listen(8080, function() {
  console.log('listening on *:8080');
});
