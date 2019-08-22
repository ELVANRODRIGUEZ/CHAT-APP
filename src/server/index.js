let app = require('http').createServer();
/*
We require the "socket.io" npm package and pass a function as argument onto it. In this case, the function "app", which creates a server.
We are also making it available to other files within the app by immediately exporting it at declaration time.
*/
let io = module.exports.io = require('socket.io')(app);

//We assign a port number for the server.
const PORT = process.env.PORT || 3231;

//SocketManager brings all the server endpoints available for the client to communicate with it.
const SocketManager = require('./SocketManager');

//Here we pass a function at "connection" event; in this case, all the functions imported from the "SocketManager" files.
io.on('connection', SocketManager);

//We start listening to the port.
app.listen(PORT, ()=> {
    //At this point, the created "http" server stored in "app" variable will connecting the above created "io" socket stored in "io" which was declared with the created server "app" passed on as argument, so this "listen" method also makes available the Socket Emissions made from the Client.
    //Production console.
    console.log("Connected to port: " + PORT);
})

