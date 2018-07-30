// Routes vs controllers
// https://www.terlici.com/2014/09/29/express-router.html

var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var hbs  = require('express-hbs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var db = require('./database');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

// Include controllers
app.use(require('./controllers'));

// Include assets
app.use(express.static(__dirname + '/public'));

// Setup template engine
app.engine('hbs', hbs.express4({extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.broadcast.emit('broadcast', socket.id + ' connected');
    io.emit('system', 'hello');

    socket.on('disconnect', function() {
        console.log(socket.id + ' disconnected');
        socket.broadcast.emit('broadcast', socket.id + ' disconnected');

        if (io.engine.clientsCount == 0) {
            // Close database properly
            //db.close();
        }
    });

    socket.on('chat message', function(msg) {
        socket.broadcast.emit('chat message', msg);
    });
});

// Start server
http.listen(8080, function() {
  console.log('listening on *:8080');
});
