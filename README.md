# Node.js chat server

## Installing NodeJS
Since the package in the official repository isn't always up-to-date, we have to get the latest version using this command:
```sh
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
```

This will now install the current version

```
sudo apt-get install -y nodejs
```

## Hello World
Creating a Hello World Application in NodeJS doesn't require very much. Since we have the nodejs-package already installed on our system, all we need is the following line that we put in `server.js`:
```js
console.log("Hello World!");
```

When we execute this script by calling
```sh
node server.js
```
we can see "Hello World!" popping up on screen. Fantastic, isn't it? It will get a lot more complex down the road but you've just taken your first step into the world of Node!

## Hello World - The next level
While the console is great for debugging and stuff, we actually want to put things on the web, don't we? So let's do that now!

To be able to access our code from a webbrowser we will need a server. The standard-server for NodeJS is ExpressJS, so that's what we will be using as well. From within your project-directory run:

```sh
npm install express
```

You might not have noticed, but next to installing express this little command created a file called `package-lock.json` in your project-folder. We will cover what that's all about and why it's actually really great in a separate chapter.

For now we just override our `server.js` with toe following piece of code:
```js
// Include a bunch of stuff
var express = require('express')
var app = express();
var http = require('http').Server(app);

// This section is responsible to handle requests to localhost:8080
app.get('/', function(req, res) {
    res.send('Hello World!');
});

// Another section that will be responsible for requests to localhost:8080/another
app.get('/another', function(req, res) {
    res.send('Another World!');
});

// Start a server that listens to port 8080
http.listen(8080, function() {
  console.log('listening on *:8080');
});
```

After executing
```
node server.js
```

we go to our browser, visit localhost:8080, then localhost:8080/another, check out all the cool things that are happening and sit in awe.

## The structure of a NodeJS-Project

[project_name]  
|---- config  
|---- controllers  
|---- models  
|---- public  
|---- views  
|---- package.json
|---- server.js

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

## Handling requests
To-Do...

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

## Socket.IO
Socket.IO provides WebSockets
```
npm install --save socket.io
```

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
    });
    db.close();
});
```

## Mongoose
Using basic Mongo in our project is definitely doable but not very efficient in terms of maintainability. As you can see there's a lot of boilerplate code required for even basic tasks as checking for a user.

Mongoose is a wrapper for MongoDB that makes it a lot easier to handle database-queries

```sh
npm install mongoose
```

With mongoose you create a model that acts as a middleman between your application and the database. It adds a layer of abstraction so that you don't have to deal with database-queries throughout your entire code. Instead we choose the object-oriented-approach of using models and methods to make the code much more readable and maintainable.

First we need a connection to the Mongo-database. We establish that in `config/database.js`
```js
var mongoose = require('mongoose');
mongoose.connect(`mongodb://127.0.0.1:27017/chat`)
```

Next up is the model. We are creating a so called 'schema' for users with only the most basic attributes of username and password each of type String. You can get as complex as you wish with this, have nested attributes and a whole lot of other types. [Check out the documentation](http://mongoosejs.com/docs/schematypes.html) for more information.

For the purpose of this tutorial these two attributes will suffice. The following piece of code goes in `models/user.js`
```js
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Create a model from the schema and make it publicly available
module.exports = mongoose.model('users', UserSchema)
```

With this in place, checking if a user exists boils down to just the following (adjust the require-path according to the location of the script you put this in):
```js
var User = require('./models/user');
User.findOne({username: 'alice'}, function(err, user) {
    if (err) throw err;

    if (user) {
        console.log("user exists");
    }
    else {
        console.log("user does not exist");
    }
});
```

Much less code compared to the original approach in pure mongo, much more readable all most of all: you don't have to connect and disconnect to and from the database with every query.

#### Custom methods
And the fun doesn't end there! The example above was pretty simple, but what if you would extend that to: 'Check, if the user exists - if not: create it!". While using mongoose will already greatly improve our code compared to pure mongo, it would still be a huge mess (especially if this action occurs more than once in your project).

**Custom methods to the rescue!**

In our schema we can add methods to encapsulate complex logic to avoid boilerplate-code even further. Let's modify our `models/user.js`
```js
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String
});

UserSchema.statics.findOrCreate = function(data, callback) {
    // We can't use 'this' inside the function
    var User = this;

    this.findOne(data, function(err, user) {
        if (err) throw err;

        if (!user) {
            // User does not exist - create it!
            user = new User(data);
            user.save();
        }

        // Return result
        callback(user);
    });
};

// Create a model from the schema and make it publicly available
module.exports = mongoose.model('users', UserSchema)
```

Frankly, that's not too much code but it would still clutter our files if we were to use this in multiple places.

If we want to work with the result of this method, we must provide a callback-function because findOne() works asynchronously and returns 'undefined' right away before processing.

You access this functionality by using merely four lines of code:
```js
var User = require('./models/user');

User.findOrCreate({username: 'alice'}, function(user) {
    // This either returns an existing or a newly created 'alice'
    console.log(user);
});
```

**But wait! There's even more!**

Static methods (which we used so far - hence the keyword 'statics') require you to add some sort of identification if you want to run actions on single users. There's a better way to handle this:
```js
// Assuming we would have firstName and lastName in our schema...
UserSchema.methods.getFullName = function() {
    return this.firstName + " " + this.lastName;
}
```

```js
User.find({}, function(err, users) {
    if (err) throw err;

    for (var i in users) {
        console.log(user[i].getFullName());
    }
});
```

## Templates
Handlebars is a template engine
```
npm install express-hbs --save
```

To-Do...

## Authentication
```sh
npm install passport passport-local express-session bcrypt-nodejs
```

passport is a very easy way to add authentication in ExpressJS  
It requires setting up a config first

`config/passport.js`
```js
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport) {
    // Serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('register', new LocalStrategy({
        passReqToCallback : true // allow passing back the request to the callback
    },
    function(req, username, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

            // Check if user exists
            User.findOne({ 'username':  username }, function(err, user) {
                // Return errors if any
                if (err)
                    return done(err);

                // Check to see if there's already a user with that username
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'Username already exists.'));
                }
                else {
                    // Create user
                    var newUser = new User();

                    // Set credentials
                    newUser.username = username;
                    newUser.password = newUser.generateHash(password);

                    // Save user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    passport.use('login', new LocalStrategy({
            passReqToCallback : true // allow passing back the request to the callback
    },
    function(req, username, password, done) {
        User.findOne({ 'username': username }, function(err, user) {
            // Return errors if any
            if (err)
                return done(err);

            // If no user was found or the password is incorrect
            if (!(user && user.validPassword(password)))
                return done(null, false, req.flash('loginMessage', 'Invalid credentials.')); // req.flash is the way to set flashdata using connect-flash

            // Successful login
            req.session.myuser = "worx";
            return done(null, user);
        });

    }));
}
```

`server.js`
```js
var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var db = require('./database');
var passport = require('passport');
var session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup passport
require('./config/passport')(passport);
app.use(session({ secret: 'mylittlesecret' })); // session secret
app.use(passport.initialize());
app.use(passport.session());

// Include controllers
app.use(require('./controllers'));

// Start server
http.listen(8080, function() {
  console.log('listening on *:8080');
});

```

`controllers/user.js`
```js
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.get('/', isLoggedIn, function(req, res) {
    res.send('private area')
});

router.get('/register', function(req, res) {
    res.render('user/register', { message: req.flash('signupMessage') });
});

router.post('/register', passport.authenticate('register', {
    successRedirect: '/chat',
    failureRedirect: 'register',
    failureFlash: true
}));

router.get('/login', function(req, res) {
    res.render('user/login', { message: req.flash('loginMessage') });
});

router.post('/login', passport.authenticate('login', {
    successRedirect: '/chat',
    failureRedirect: '/user/login',
    failureFlash: true
}));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/user/login');
});

// Check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // User is logged in, go on
        return next();
    }

    // User is not logged in, redirect to login
    res.redirect('/user/login');
}

module.exports = router;
```
