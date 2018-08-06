# Node.js tutorial

## Installing NodeJS
Since the package in the official repository isn't always up-to-date, we have to get the latest version using this command:
```sh
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
```

This will install the current version:
```
sudo apt-get install -y nodejs
```

Now we need a folder to give our project a home. You can obviously call it whatever you like, I will be using `node_tutorial`
```sh
mkdir node_tutorial
```

## Hello World
Before we move on to more boring stuff like setting up or project properly, let's do something fun!
Creating a Hello World Application in NodeJS doesn't require very much. Since we have the nodejs-package already installed on our system, all we need is a file called `server.js` in our project-folder with the following line in it:
```js
console.log("Hello World!");
```

When we execute this script by calling
```sh
node server.js
```
we can see "Hello World!" popping up on screen. Fantastic, isn't it? It will get a lot more complex down the road but you've just taken your first step into the world of Node!  
Having our motivation boosted, we can eagerly move on!

## Working with npm
With the installation of the nodejs-package also came a tool called 'npm' (Node Package Manager). We will be using this quite a bit when developing for NodeJS.
For a start it helps us setting up our project properly.

Now we can let the npm-magic happen:
```sh
npm init
```

This will ask you for a couple of things. You should at least enter your project's name, the current version and your name as the author.
Setting the **entry point** to `server.js` helps anyone working with your project to have this information easily accessible without having to search through all your files.
The rest of the fields can be left blank for now.

When finished we will end up with a `package.json` in our project-root based on our inputs. Let's have a closer look into that.

Opening the `package.json` you will see something similar to this:
```json
{
  "name": "node_tutorial",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "paranerd",
  "license": "ISC"
}
```

Never mind that 'Error'-part in the 'scripts'-section. You could replace it with your own command to run tests on your project. We don't have those right now, so we'll just ignore it.

#### Installing packages
Apart from setting up a project, npm (as the name suggests) is mostly used for managing packages.  
To demonstrate, let's install nodemon:
```sh
npm install nodemon
```

Nodemon is a really helpful tool for developing in NodeJS. Normally, when changing something in your code, you would have to kill and restart node for the changes to apply. Doesn't sound like a lot of effort, but trust me, it adds up and gets really annoying really fast.  
Similarly when you have a bug in your code (which will happen A LOT), node would just crash and you'll have to manually restart it.

Nodemon takes this burden off your chest. It monitors your files and automatically restarts the server on changes. When it encounters a bug, it goes into halt, waits for you to update the file and tries again.

Running the command will create a folder `node_modules/` in our project-root and install nodemon there.

Checking your `package.json` you can see that there is a new section 'dependencies' looking something like:
```json
{
    "dependencies": {
        "nodemon": "^1.18.3"
    }
}
```

By default npm adds every package you install to that section. This is especially great when working with lots of packages.  
The `node_modules/` folder can get quite big and you don't necessarily want it in your backup, your version management or have to move it around to everyone that wants a copy of your code.

With the `package.json` in place you can omit the `node_modules/` entirely and a simple call to
```sh
npm install
```
will automatically re-install all dependencies for you.  
Give it a try: remove `node_modules/`, run the install-command and watch the folder and its contents magically re-appear!

#### Setting a startup script
Having nodemon installed we can tweak our packages.json a bit:
```json
{
    "scripts": {
        "start": "nodemon server.js"
    }
}
```

Now when anyone calls
```sh
npm start
```
from within your project-folder, it starts the server without them having to figure out its entry point.

There is so much more npm is capable of, but diving into all of it would be beyond the scope of this tutorial.  
For anyone who's interested, check out their [documentation](https://docs.npmjs.com)

## Hello World - The next level
Our first Hello World example was great and all, but while the console is extremely helpful for debugging, we actually want to put things in the browser, don't we? So let's do that now!

To be able to access our code from a webbrowser we will need a server. The standard-server for NodeJS is ExpressJS, so that's what we will be using as well. We install it using npm from within your project-directory:
```sh
npm install express
```

Now we just completely override our `server.js` with the following piece of code:
```js
// Include express
var express = require('express')

// Create an instance
var app = express();

// Create the server
var http = require('http').Server(app);

// Take requests to our server-root and answer by sending back "Hello World!"
app.get('/', function(req, res) {
    res.send('Hello World!');
});

// Start the server on port 8080
http.listen(8080, function() {
  console.log('listening on *:8080');
});
```

Fire up the server (if not still running) using
```
npm start
```

then open your browser, visit [localhost:8080](localhost:8080), check out all the cool things that are happening and be amazed!  
Well, it's really just text so far, so don't waste your time waiting for something special to come up here^^ - but don't worry, there are special things to come!

## How to structure a NodeJS-Project
Before we go any further, let's have a quick look into the general structure of a NodeJS-Project. When you search the web for suggestions on that, you will be flooded with a miriad of opinions on what's the best way to organize your code. To be honest, I don't claim perfection for my approach. I simply took the best out of all that I could find on this topic and what I came up with works great for me. So in the end you're getting just another opinion here^^. Feel free to go out there and find your own way - just make sure that you actually DO have any sort of organization in your project and don't just throw everything in one folder.

For the sake of this tutorial, we'll be using the following structure:

project/  
|-- config/  
|-- controllers/  
|-- models/  
|-- public/  
|-- views/  
|-- package.json  
|-- server.js

Let me explain...

#### config/
As the name suggests, this is where all your configuration files go, for example database-credentials, access-tokens and the like. It's great to have all these in one place and not scattered all over the place.

#### controllers/
We will cover controllers in another chapter, so just the basics at this point. Controllers are a great way to handle the routing of your site. They may seem overkill on very small applications but trust me, you're going to love them once you've got more than a handful of routes to take care of. I suggest you use them no matter the size of your project. That way all your projects are going to have the same 'skeleton' which helps tremendously when maintaining. Besides it's a real pain to rework your previously tiny no-structure project into a structured one because you lost track of all your files when that sneaky little app quietly grew bigger. But again: more on all of that in its own chapter.

#### models/
Some more slightly more advanced stuff in here. Models provide a layer of abstraction between your code and the database. They make sure you don't have to mess around with database-specific stuff. That gives you some freedom in choosing your database and keeps your code clean. We will be covering this in a dedicated chapter as well.

#### public/
This is where all your CSS, JavaScript, images and all the other static assets live. It's called 'public' because the files in there usually require to be directly publicly available (as compared to the code in your models, that you might want to keep private).

#### views/
If you're not completely new to web development, you might have noticed: we're working with an MVC-Framework here. M for Model, C for Controller and V for... you guessed it: View. Views are basically your HTMLs (or templates, but we'll get to that later).

#### package.json
Very important file, especially when it comes to working in a team or when publishing your code. We will be covering this in more detail in its own chapter (that's just how important it is!). Basically this file holds some general information about your project, such as its name, the current version, a description, the developers name. In addition (and perhaps more important) it contains details about the packages your project depends on. With this setup other developers don't have to manually figure out what to install but can instead simply use a tool called 'npm' to do this automatically. More on that in a dedicated chapter.

#### server.js
This is the starting point of your application. It's what you call when you fire up your server (hence the name^^) and it acts as a root that connects all the other pieces.

## Working with HTML
So far we only sent plain text to the browser. Already kind of exciting but we want to be able to serve really cool HTML, don't we?! Let's go do that right now!

In our `views/` directory we add a file called `index.html`:
```html
<!DOCTYPE html>
<head>
    <title>My first NodeJS-App</title>
</head>
<body>
    <h1>Hello World!</h1>
</body>
</html>
```

Now we modify our `server.js` and replace the old routing with this one:
```js
app.get('/', function(req, res) {
    // This time don't send plain text, but this file
    res.sendFile('index.html', {root: 'views'});
});
```

This tells the express-server: "If a visitor comes to our website, show him the `index.html` from folder `views/`"

Check it out yourself on [localhost:8080](localhost:8080)!

We are greeted with a nice "Hello World!" again but this time it's not plain text but some really cool HTML \*wooow\*  
To make this even more amazing, let's go ahead and add some design to our page!

## Adding CSS and JavaScript
Even if our HTML-Hello-World is very cool, it does still look a little boring. Time to add some styling!

In our `public/` folder we first add subfolder called `css/`. In there we create a file `design.css` with the following content:
```css
h1 {
    color: red;
}
```

We reference this file in our `views/index.html` as we normally would:
```html
<head>
    <link rel="stylesheet" type="text/css" href="/css/design.css">
</head>
```

In a vanilla HTML-Appliction this would do, but in NodeJS we still have to tell express where to look for our public assets.  
To do this we add this to our `server.js` somewhere between the variable declarations and the server startup
```js
app.use(express.static(__dirname + '/public'));
```

\_\_dirname is a NodeJS-variable that gives us the absolute path of the parent-directory of the file it is called in (meaning its value is different depending on the file).  
Not hardcoding the path to our project allows it to be portable between different systems.

Start the server, fire up the browser and look at this magnificent red!

Now that express already knows where our public files are, including JavaScript in our `index.html` is very easy.  
For the sake of a clear structure I recommend putting your JavaScript-files into a designated folder as well.  
Create a file `main.js` inside the to-be-created fodler `public/js/`:
```js
alert("I. AM. JavaScript!");
```

Reference it in the `index.html`:
```html
<body>
    <!-- All other code -->
    <script src="js/main.js" type="text/javascript"></script>
</body>
```

You might want to disable the alert after you checked that it actually works, because it would be rather annoying to have this popping up throughout the rest of this tutorial.

Since the scope of this tutorial is NodeJS, we won't be covering CSS or (client-side) JavaScript more than necessary. I will leave it to you to get crazy with awesome designs and amazing functions.

## Basic routing
So far we've only set up a single landing page. In some cases this is sufficient, but usually you might want to have other pages on your website as well.
To demonstrate how this works with Node and Express, we will prepare a nice little login form.

For that we need a file `views/login.html` with the following content:
```html
<!DOCTYPE html>
<head>
    <title>Login</title>
</head>
<body>
    <h1>Login</h1>
    <form action="login" method="post">
        <input type="text" name="username" placeholder="Username" />
        <input type="password" name="password" placeholder="Password" />
        <button>Login</button>
    </form>
</body>
</html>
```

Only basic HTML there. We have a form containing two input fields named 'username' and 'password'. Clicking 'Login' will not result in anything right now, because our server doesn't know how to handle it yet.
This chapter focusses on displaying, we'll add functionality in the next one.

Despite the `login.html` being in the same directory as the `index.html`, express wouldn't know what to do with it, so we need to tell it.
For that we add another routing-rule after the one handling requests to '/':
```js
app.get('/login', function(req, res) {
    res.sendFile('login.html', {root: 'views'});
});
```

Fairly straight forward compared to the other rule. This one listens to localhost:8080/login and returns our `views/login.html` upon request.
Try it - go to [localhost:8080/login](localhost:8080/login) and check out our new login-form! Not very pretty, but functional - and since you already know how to add styling to your page, knock yourselves out and make this the best-looking login-screen the world has ever seen!
You can also play around and add more HTMLs and more routes - you'll see that it's not all that complicated to add new pages.

Just as a sidenote: while adding all your routes to the `server.js` works perfectly well for small pages with only a couple of routes, things get messy very quickly when your site starts to grow.
For now we can work with this approach, but I will show you a better way of organizing our routes in a later chapter.

## Processing user input
Displaying a login-screen is one thing, but it doesn't help us all that much if we can't process the user's input, right?!
Let's add this feature now!
First, we need to install another package that allows us to extract data from POST-requests:
```sh
npm install body-parser
```

We need to include the body-parser in our `server.js` so we can use it:
```js
var express = require('express')
var app = express();
var http = require('http').Server(app);
// Include body-parser
var bodyParser = require('body-parser');

// Tell express to use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    res.sendFile('index.html', {root: 'views'});
});
// ...
```

With this in place we can add yet another routing-rule in our `server.js`:
```js
app.post('/login', function(req, res) {
    console.log("Username: " + req.body.username);
    console.log("Password: " + req.body.password);
    res.redirect('/');
});
```

What are we doing here? We're telling express to listen for POST-requests to localhost:8080/login. From the body of those requests we're extracting 'username' and 'password' (since that's what we named our &lt;input&gt;-Elements in `login.html`). Check out your console to see both of them displayed there. Then we're redirecting the user to our landing page.
We can now process this information however we like. Proper authentication would be nice, right? Don't worry, we'll get to that in a little bit!

## Advanced Routing
As we've already learnt, the basic approach to routing can make our `server.js` unreadable in bigger projects. In this chapter we'll get to know a slightly better way to do it (spoiler alert: there's an EVEN better version, but we'll get to that later).

To keep our `server.js` nice and clean, it's usually better to handle routing in a dedicated place

For that we create a `routes.js` in our project-root with the following content:
```js
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.sendFile('index.html', {root: 'views'});
});

router.get('/login', function(req, res) {
    res.sendFile('login.html', {root: 'views'});
});

router.post('/login', function(req, res) {
    console.log("Username: " + req.body.username);
    console.log("Password: " + req.body.password);
    res.redirect('/');
});

module.exports = router;
```

Notice that the routes themselves are just copied and pasted with 'app' being replaced by 'router'

Now we have to remove all the routes from our `server.js` and tell it to use our new `routes.js`.  
The final result will look like this:
```js
// Include a bunch of stuff
var express = require('express')
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Include our router-file
var routes = require('./router.js');

// Let it handle all requests
app.use('/', routes);

// Start a server that listens to port 8080
http.listen(8080, function() {
  console.log('listening on *:8080');
});
```

While this is already a lot better and makes the `server.js` a lot more readable, we would still end up with one huge file for all the requests.  
This is where controllers come in...

## Controllers
Controllers allow organizing your site's routing into smaller, more maintainable chunks.  
Now we can finally use that `controllers/` folder!

What this system does is separating our routes into controllers, each with a specific job.  
For example, in a webshop you might have one controller for handling requests to articles, another for account-management and yet another for customer-support.

Let's create our first controller `controllers/users.js`!
```js
var express = require('express');
var router = express.Router();

router.get('/login', function(req, res) {
    res.sendFile('login.html', {root: 'views'});
});

router.post('/login', function(req, res) {
    console.log("Username: " + req.body.username);
    console.log("Password: " + req.body.password);
    res.redirect('/');
});

module.exports = router;
```

This should all look very familiar, as it's just regular "advanced routing" that we saw in the previous chapter.

Next up we create `controllers/index.js`
```js
var express = require('express');
var router = express.Router();

// Including all our controllers here
router.use('/user', require('./user'));

// Handle "top-level-requests"
router.get('/', function(req, res) {
    res.sendFile('index.html', {root: 'views'});
});

module.exports = router;
```

This will be responsible for including the user-router. To do that it requires our `user.js` (the file-extension can be omitted, NodeJS is that smart!) and binds it to all requests coming in for 'localhost:8080/user'
That is important to remember as the route the user-controller is taking care of is NOT 'localhost:8080/login' but rather 'localhost:8080/user/login'. Might be a bit confusing at first, but it's useful down the road.

In addition, the `index.js` will handle all the requests that we don't have a controller for (such as the landing page).

To let express know about the change in our routing-system, we edit our `server.js` like so:
```js
// Include our router-file
//var routes = require('./router.js');

// Let it handle all requests
//app.use('/', routes);

// Include controllers
app.use(require('./controllers'));
```

When requiring a folder, NodeJS will by default look for an `index.js` in it, so we don't have to specify the filename here.  
Because we're including the user-controller in that file, this is sort of like a requirements-chain and we end up with express knowing about all routers.

Check it out: go to [localhost:8080/user/login](localhost:8080/user/login) and see that... well... nothing really changed visually.  
But under the hood we got a lot cleaner, way more structured code that will be way more maintainable when working on bigger projects and with other developers.

## Organizing views
So far we only have to manage two views - no big deal. But imagine having dozens of different pages, which is not at all unusual. Having all those views in one single views-folder would be a huge mess and very difficult to manage and maintain.  
Therefore it's usually better to use sub-folders to organize our views.

Following the pattern of our controllers, we create two folders: `views/main/` and `views/user/`. Similar to the `controller/index.js` the `views/main/` will contain all views that we don't have a specific controller for.

We move our `views/index.html` to `views/main/` and `views/login.html` to `views/user/` respectively. For our controllers to find them we need to update their paths.
`controllers/index.js`:
```js
router.get('/', function(req, res) {
	res.sendFile('index.html', {root: 'views/main'});
});
```

`controllers/user.js`:
```js
router.get('/login', function(req, res) {
    res.sendFile('login.html', {root: 'views/user'});
});
```

Checking out the changes in our browser, hopefully we won't be noticing any differences as they were purely 'under the hood' for the sake of clean code, efficient development and our sanity when managing growing projects.

## Working with Templates
So far our pages have been very static, meaning we just deliver HTML without any dynamic content whatsoever. What we need is an easy way for our server to send data to the client. This is where templates come in.

There are many template engines available. Some of the more popular ones are:
- [Handlebars](https://handlebarsjs.com/)
- [Pug (Jade)](https://pugjs.org/api/getting-started.html)
- [EJS](https://www.npmjs.com/package/ejs)
- [Dust](http://www.dustjs.com/)

Since I found handlebars to be the most comprehensible and easiest for a beginner to understand, we will use it in this tutorial. Feel free to check out the others to find the engine that works best for you.

As almost always with new features, we first install a package:
```sh
npm install express-hbs
```

We then tell our `server.js` that we want to use this package
```js
var hbs  = require('express-hbs');
```

For it to be working properly, we need to add some more details:
```js
// Create a handlebars-instance
app.engine('hbs', hbs.express4({extname: '.hbs'}));
// Set it to be the view (template) engine
app.set('view engine', 'hbs');
// Tell it where our views are located
app.set('views', __dirname + '/views');
```

The default extension for handlebars-files is '.handlebars'. That's pretty verbose, so we change that and tell the engine to look for files ending with '.hbs' instead. Not mandatory at all, but a little easier on the eyes.

#### Templates in action
For our template engine to recognize our view files as such we first need to rename them according to our chosen extension:
- `views/main/index.html` -> `views/main/index.hbs`
- `views/user/login.html` -> `views/user/login.hbs`

One great thing about handlebars over the also very popular pug - at least in my opinion - is that it doesn't require rewriting HTML-markup. So we basically use standard HTML and add pieces handlebars in some places making it easily readable even for other developers not familiar with handlebars.

To use handlebars to display a view we need to modify our routing.
First in `controllers/index.js`
```js
router.get('/', function(req, res) {
    res.render('main/index', {greeting: 'Hello Again!'});
});
```

We're replacing 'sendFile' with 'render'. While their syntaxes look very alike, they're behaving quite differently.

Most noticably we don't specify the parent-folder of our view as 'root' in the curly brackets anymore. Instead we defined the root to **all** our views in the `server.js` and are passing the relative path to our view based on that root as the first parameter to 'render()'.

The second parameter is where the actual magic happens. Here we're passing a variable 'greeting' with its value to be used in our HTML

Changes in `controllers/user.js` accordingly:
```js
router.get('/login', function(req, res) {
    res.sendFile('user/login', {});
});
```

We're not providing any variables here, to we leave the curly brackets empty.

Refreshing the browser on [localhost:8080](localhost:8080) won't show any differences because it doesn't use the passed variable yet. To change that, let's modify our &lt;body&gr;-section in `views/main/index.hbs`:
```html
<body>
    <h1>Hello World!</h1>
    <h2>{{greeting}}</h2>
</body>
```

The double curly braces (which look like the handlebars of a motorbike tilted 90 degrees - hence the name) are handlebars-syntax. It tells the template engine to replace this part with the value of the variable passed we passed it. If we wouldn't have passed this variable, handlebars would replace it with an empty string.

There's more to learn about handlebars that would be beyond the scope of this NodeJS-Tutorial. If you're interested, check out [the projects homepage](https://handlebarsjs.com/) for more information.

## Working with sessions
Sessions are a simple way of persisting information between page requests. They make it easy to save a value in some part of your website and retrieve that value at a completely different place without having to manually send it there.

A session is nothing magical, just an array of key-value-pairs saved on the server accessed by the browser via a Session-ID which is stored in a cookie. The Session-ID enables us to have different sessions for different users of our website at the same time.

To use sessions in our express-server, we need another package:
```sh
npm install express-session
```

Setting up the session in our `server.js` is super easy. First we need to tell it that we're using this new package now:
```js
var session = require('express-session');
```

Then we give it some details about how we want it to be set up:
```js
app.use(session({
	secret: 'mylittlesecret',
	resave: true,
	saveUninitialized: false,
	cookie: { maxAge: 3600 }
}));
```

Let's break this down so we know what's going on:

The 'secret' parameter is used to sign the Session-ID-Cookie to verify access. In the real world you might want to use something a little (well, actually A LOT^^) stronger than what we use here.

Setting 'resave' to true forces the session to be saved back to session store even if the session was not modified during a request. We would normally set this to false but as I happen to know of a future usecase that requires it to be true, we will use this setting for now.

Having 'saveUninitialized' set to true would result in the session being saved to the store even if has not been initialized yet (we did not yet modify it in any way). This would cause querying the session-store more than necessary and waste precious space on disk.

A 'maxAge' of 3600 for our cookie will invalidate the session after an hour (a kind of auto-logout).

Apart from 'cookie' these are all required options, so you have to give them a value. There's a bunch of others that you can check out in the [documentation](https://www.npmjs.com/package/express-session)

Now let's see a session in action, shall we?!

In our `controllers/user.js` we modify our POST-route to login as follows:
```js
router.post('/login', function(req, res) {
	req.session.username = req.body.username;
    res.redirect('/');
});
```

We access the session through the request-object to store the passed username in it.

To display the username, we change our `controllers/index.js`
```js
router.get('/', function(req, res) {
	res.render('main/index', {username: req.session.username});
});
```

Finally, we adjust our template:
```html
<body>
    <h1>Hello {{username}}</h1>
</body>
```

**That's all!**

Now we go to [localhost:8080/user/login](localhost:8080/user/login), enter a username, hit 'Login' and lose our minds to see that our website knows who we are!

## Working with a database
#### Quick introduction to MongoDB
MongoDB is a so-called NoSQL-Database (in contrast to SQL-Databases like MySQL). Unlike traditional databases these don't require fixed table relations or a pre-defined schema which makes them more flexible to work with.  
While NoSQL is not out there to replace SQL there are use cases where they're better suited for the job.
Using MongoDB with NodeJS is great because it works extremely well with JavaScript. Entries in a MongoDB-Database are called 'documents' which are JSON-Objects in binary form (called BSON). This makes exchanging data between code and database almost seemless. A document to store a user might look like this:
```json
{
    "username": "John",
    "password": "a789dbe97890ffc"
}
```
Documents are grouped in collections, so we can have a collection 'users' containing all the... well... users^^
The flexible, schema-less nature of MongoDB enables us to simply add another attribute (e.g. 'interests') to one document without affecting all other documents. In MySQL this would require a migration and potential downtime of the entire database.  
In MongoDB it's perfectly okay for documents to have a varying set of attributes, which is just not possible in MySQL.

MongoDB allows for easier mapping of real world objects to a database-entry because related information is stored together, which is especially great for object oriented programming:
```json
{
    "username": "John",
    "password": "a789dbe97890ffc",
    "address": {
        "street": "5th Ave",
        "number": 350,
        "zip": "NY 10118"
    },
    "interests": [
        "reading",
        "biking",
        "hiking"
    ]
}
```

For a more in-depth introduction to MongoDB as well as a comparison between MongoDB and MySQL, check out [this great article](https://www.mongodb.com/compare/mongodb-mysql)

#### Setting up MongoDB
First we need the linux-packages
```sh
sudo apt install mongodb mongodb-clients
```
This will install the MongoDB-Server as well as a client to be able to check our database from the command line

Then we start the server
```sh
sudo service mongodb start
```

Install the node-package
```sh
npm install mongodb
```

#### Using MongoDB

This is the code we add to our `server.js` to connect to the Mongo-Database:
```js
// Include the mongodb-package
var mongo = require('mongodb').MongoClient;

// Connect to the mongodb-server that listens on port 27017
var mongoUrl = 'mongodb://localhost:27017';

mongo.connect(mongoUrl, function(err, db) {
    // Throw an error if something went wrong
    if (err) throw err;

    // Otherwise we're good
    console.log("MongoDB connected");

    // Use the database 'node_tutorial'
    // It doesn't exist yet, but don't worry, mongodb automatically creates it for us
    var dbo = db.db('node_tutorial');

    // Create a new user
    var user = {
		username: "John",
		password: "a789dbe97890ffc"
	};

    // Insert it into the collection 'users' (mongodb creates this on the fly as well)
	dbo.collection('users').insertOne(user, function(err, res) {
		if (err) throw err;

		console.log("inserted");
	});

    // Close the database-connection
    db.close();
});
```

Seems like a lot of code, but it's not that complicated. This is a good example of MongoDB integrating well with JavaScript. Passing a JSON-object that JavaScript understands to the database is just super easy.

Querying documents is not exactly rocketscience either:
```js
// Give me all the users with username 'John'
dbo.collection('users').find({username: 'John'}}, function(err, res) {
    if (err) throw err;

    if (res) {
        console.log("User exists");
    }
    else {
        console.log("User does not exist");
    }
});
db.close();
```

Aside from code it's sometimes nice to have some sort of 'direct' access to our database, e.g. for degugging. To do this, we open another terminal window and connect to the MongoDB-Server
```sh
mongo
```

We tell the server that we want to access our 'node_tutorial' database
```sh
use node_tutorial
```

Inside this database we can now more or less use the same command that we used in JavaScript to get our newly inserted user:
```sh
db.users.find({username: 'John'})
```

For more information about querying MongoDB, check out [the documentation](https://docs.mongodb.com/manual/crud/)

If you're coming from a MySQL background, you will find this [mapping of SQL-commands to MongoDB](https://docs.mongodb.com/manual/reference/sql-comparison/) helpful.

We've covered the most basic way NodeJS can communicate with MongoDB and it works perfectly fine. But as it can get a little verbose and we love clean code, we choose to do it slightly different...

## Mongoose
Using basic Mongo in our project is definitely doable but not very efficient in terms of maintainability. As you can see there's a lot of boilerplate code required for even basic tasks as checking for a user.

Mongoose is a wrapper for MongoDB that makes it a lot easier to handle database-queries

```sh
npm install mongoose
```

Mongoose uses so-called models that act as middlemen between the application and the database. It adds a layer of abstraction so that we don't have to deal with database-queries throughout your entire code. Instead we choose the object-oriented-approach of using models and methods to make the code much more readable and maintainable.

First we need a connection to the Mongo-database. We establish that in `config/database.js`
```js
var mongoose = require('mongoose');
mongoose.connect(`mongodb://127.0.0.1:27017/node_tutorial`)
```

Next up is the model. Finally we're using that `models/` folder! We are creating a so-called 'schema' for users with only the most basic attributes of username and password each of type String. You can get as complex as you wish with this, have nested attributes and a whole lot of other types. [Check out the documentation](http://mongoosejs.com/docs/schematypes.html) for more information.

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

If we want to work with the result of this method, we must provide a callback-function because findOne() works asynchronously and returns 'undefined' immediately before processing.

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

## Authentication
The so-called 'Login-System' that we put up so far isn't quite... secure, to say the least. The way it is implemented now, anyone could come by, 'login' and have an account created for him
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

## Accessing the session with SocketIO
[The docs](https://www.npmjs.com/package/express-socket.io-session)

```sh
npm install express-socket.io-session
```

```js
var session = require('express-session')({
    secret: 'mylittlesecret',
    resave: true,
    saveUninitialized: true
});

var ioSession = require("express-socket.io-session");

// To have changes visible in express-session as well
io.use(ioSession(session, {
    autoSave:true
}));

io.on('connection', function(socket) {
    socket.handshake.session.test = 'this works');

    console.log(socket.handshake.session);
});
```
