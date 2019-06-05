# NodeJS Chat

This is a Live Chat based on NodeJS and WebSockets with Socket.IO. I built it to demonstrate a usecase for WebSockets. You can sign up and join a chat of potentially thousands of clients.

You can check out how it's built in my "[Hello NodeJS](https://thegermancoder.com/2018/09/17/hello-nodejs-installation/)" introduction to NodeJS as well as my "[How To Build A Live Chat With WebSockets](https://thegermancoder.com/2018/10/17/how-to-build-a-live-chat-with-websockets/)".

## Prerequisites
Install some packages required
```
sudo apt install curl mongodb mongodb-clients
```

Install NodeJS
```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
```

```
sudo apt-get install -y nodejs
```

Start MongoDB
```
sudo service mongodb start
```

Move into project folder
```
cd /path/to/node-chat
```

Install NodeJS-dependencies
```
npm install
```

## Run
```
npm start
```
