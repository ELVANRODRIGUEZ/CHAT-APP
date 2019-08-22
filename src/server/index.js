//We require the "express" Npm Package.
const express = require('express');
//Create an instance of the express execution named "app".
const app = express();
//Then we require "http", run its "Server" method with the variable of the "express" execution instance ("app") and store it inside a "server" const.
const server = require('http').Server(app) ;
/*
We require the "socket.io" npm package and pass a function as argument onto it. In this case, the function "server", which has created a server.
We are also making it available to other files within the app by immediately exporting it at declaration time.
*/
const io = module.exports.io = require('socket.io')(server);

//We assign a port number for the server.
const PORT = process.env.PORT || 3231;

//SocketManager brings all the server endpoints available for the client to communicate with it.
const SocketManager = require('./SocketManager');

//When working with servers and React, we need to make sure to always send to the server our files from a "build" folder.
app.use( express.static(__dirname + '/../../build'));
//Here we pass a function at "connection" event; in this case, all the functions imported from the "SocketManager" files.
io.on('connection', SocketManager);

//We start listening to the port.
server.listen(PORT, ()=> {
    //At this point, the created "http" server stored in "app" variable will connecting the above created "io" socket stored in "io" which was declared with the created server "app" passed on as argument, so this "listen" method also makes available the Socket Emissions made from the Client.
    //Production console.
    console.log("Connected to port: " + PORT);
})

