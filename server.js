var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var hbs  = require('express-hbs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var db = require('./config/database');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

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
app.use(session({ secret: 'mylittlesecret' })); // session secret
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Include controllers
app.use(require('./controllers'));

var User = require('./models/user');

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.broadcast.emit('broadcast', socket.id + ' connected');
    io.emit('system', 'hello');

    socket.on('disconnect', function() {
        console.log(socket.id + ' disconnected');
        socket.broadcast.emit('broadcast', socket.id + ' disconnected');
    });

    socket.on('chat message', function(msg) {
        socket.broadcast.emit('chat message', msg);
    });
});

// Start server
http.listen(8080, function() {
  console.log('listening on *:8080');
});
