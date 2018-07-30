# Node.js chat server

## Install NodeJS
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
```
```
sudo apt-get install -y nodejs
```

## Setup project
```
mkdir chat
```
```
cd chat
```
```
npm init
```
This will create a package.json based on your inputs

## package.json
The package.json holds all of your project's dependencies (if you install them with the --save option)

So on a later re-install you can just use
```sh
npm install
```
to have everything installed automatically

**Startup script**

Tell npm what to do to start your server
```js
"scripts": {
    "start": "node server.js"
}
```
Now anyone can simply call
```sh
npm start
```
without having to figure out which file starts your server

## Install plugins
Nodemon restarts the server on file changes
```
npm install -g nodemon
```

Express provides the actual server
```
npm install --save express
```

Socket.IO provides WebSockets
```
npm install --save socket.io
```

Handlebars is a template engine
```
npm install express-hbs --save
```

## Project structure
chat  
|---- controllers  
|---- models  
|---- public  
|---- views  
|---- server.js

## Add a basic layout
chat/views/index.html
```html
<h1>Hello world</h1>
```

## Start the server
chat/server.js
```js
var express = require('express')
var app = express();
var http = require('http').Server(app);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});

// Start server
http.listen(8080, function() {
  console.log('listening on *:8080');
});
```

Now run the server
```
nodemon server.js
```

In your browser, go to localhost:8080 to see "Hello World"

## Add CSS- and JS-Files
All static content (CSS, JS, images, etc.) belongs in the `public/` directory  
To be able to reference it, we need to tell ExpressJS where to find it in `chat/server.js`
```js
app.use(express.static(__dirname + '/public'));
```

Now you may add `public/design.css` and link to it as you normally would in `chat/index.html`
```html
<link rel="stylesheet" type="text/css" href="css/design.css">
```

## Routing
There are several different ways to implement routing in ExpressJS

###### Basic
The easiest way to implement routing is to just put the following code in your `server.js`
```js
// http://localhost:8080 displays index.html
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// http://localhost:8080/page displays page.html
app.get('/page', function(req, res){
    res.sendFile(__dirname + '/page.html');
});
```

###### Advanced
Since the basic approach can make your server.js unreadable in bigger projects, it's usually better to handle routing in a dedicated place

Create a routes.js in your project-root with the following content:

```js
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

router.get('/page', function(req, res) {
    res.sendFile(__dirname + '/page.html');
});

module.exports = router;
```
In `server.js` add the following
```js
// Include the router
var routes = require('./router.js');

// Let it handle all requests
app.use('/', routes);
```

While this is already better and makes the server.js a lot more readable, we would still end up with one huge file for all the requests  
This is where controllers come in...

## Controllers
Controllers allow organizing your site's routing into smaller, more maintainable chunks

First create `controllers/index.js`

```js
var express = require('express');
var router = express.Router();

// Include all your controllers here
router.use('/user', require('./user'));

// Handle "top-level-requests"
router.get('/', function(req, res) {
    res.send('Home page');
});

module.exports = router;
```

Nothing new in there, just regular "advanced routing" that we saw in the Routing-section

This will be responsible for loading all of the controllers/routers in this folder and thus it only requires one line in the `server.js` to enable this new routing system

Next add a file `controllers/user.js`

```js
var express = require('express');
var router = express.Router();

// This one gets requests for localhost:8080/user (rather than localhost:8080)
// because of how it was included in the controllers/index.js
router.get('/', function(req, res) {
    res.send("This is the users root");
});

module.exports = router;
```

```js
// Include controllers
app.use(require('./controllers'));
```

That last part will find the index.js in the controllers-folder and with it have access to all the routes

## Handling requests
To-Do...

## Socket.IO
[Cheatsheet](https://socket.io/docs/emit-cheatsheet/)
```js
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
```

To-Do...

## MongoDB
Install the linux-package
```sh
sudo apt install mongodb
```
Start the server
```sh
sudo service mongodb start
```
Install the node-package
```sh
npm install mongodb --save
```
```js
var mongo = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/users';

mongo.connect(mongoUrl, function(err, db) {
    if (err) throw err;
    console.log("MongoDB connected");

    var dbo = db.db('chat');

    dbo.collection('users').find({name: 'test'}}, function(dbErr, dbRes) {
        if (dbErr) throw dbErr;

        if (dbRes) {
            console.log("User 'test' exists");
        }
        else {
            console.log("User 'test' does not exist");
        }

        db.close();
    });
    db.close();
});
```

## Mongoose
Mongoose is a wrapper for MongoDB that makes it a lot easier to handle database-queries

```sh
npm install mongoose
```

To-Do...

## Templates
To-Do...
