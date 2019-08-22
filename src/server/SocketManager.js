const io = require("./index.js").io;
const {
  VERIFY_USER,
  USER_CONNECTED,
  USER_DISCONNECTED,
  COMMUNITY_CHAT,
  LOGOUT,
  MESSAGE_RECIEVED,
  MESSAGE_SENT,
  TYPING
} = require("../Events");
const { createUser, createMessage, createChat } = require("../Factories");

//An array that will contain all the users connected in the open session (or the current connection).
let connectedUsers = {};
let communityChat = createChat();

module.exports = function(socket) {
  //Test console.
  // console.log('/x1bc'); //Clears console.
  //Production console.
  console.log("Socket Id:" + socket.id);

  //We will use this function to store the calling of (or wrapping) another one ("sendMessageToChat()") and be able to pass on (and retrieve) some more arguments.
  let sendMessageToChatFromUser;
  //We will use this function to store the calling of (or wrapping) another one ("sendTypingToChat()") and be able to pass on (and retrieve) some more arguments.
  let sendTypingToChatFromUser;

  //Verify if the Username typed is connected or not. This event sends a parameter sopposed to take in a name and a Callback Function.
  socket.on(VERIFY_USER, (nickname, callback) => {
    //"isUser" function returns "true" or "false". This checks if the "nickname" passed on already belongs to the above declared "connectedUsers" array.
    if (isUser(connectedUsers, nickname)) {
      /*
            If the name passed on does belong to the "connctedUsers" array, the passed function is executed with an Object argument which sets the argument "user" to "null" and "isUser" to "true".
            Of course, the the function passed on to be executed needs to be able to accept and proccess such argument.
            */
      callback({ isUser: true, user: null });
    } else {
      /*
            If the name passed on does not belong to the "connctedUsers" array, the passed function is executed with an Object argument which sets the argument "user" to a new user by executing the "createUser" function, and "isUser" to "false".
            Of course, the the function passed on to be executed needs to be able to accept and proccess such argument.
            */
      callback({ isUser: false, user: createUser({ name: nickname }) });
      //> "createUser" function imported from: "../Factories.js"
    }
  });

  //User not already connected is allowed to connect with the typed Username. This event takes in a Callback Function with a "user" as parameter.
  socket.on(USER_CONNECTED, user => {
    //The above declared "connectedUsers" array is now assign a new value wich is itself plus the passed "user"
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user;

    //We store "sendMessageToChat" calling and pass on the "name" attribute of the "user" object.
    sendMessageToChatFromUser = sendMessageToChat(user.name);
    //We store "sendTypingToChat" calling and pass on the "name" attribute of the "user" object.
    sendTypingToChatFromUser = sendTypingToChat(user.name);

    //This emit broadcasts "USER_CONECTED" event to all the sockets connected to this "io" session, meaning, all users connected to the "chatApp".
    // io.emit(USER_DISCONNECTED, connectedUsers);
    io.emit(USER_CONNECTED, connectedUsers);
    //Test console.
    // console.log("Currently connected users:\n", connectedUsers);
  });

  //User disconnects.
  socket.on("disconnect", () => {
    if ("user" in socket) {
      connectedUsers = removeUser(connectedUsers, socket.user.name);
      //This emit broadcasts "USER_DISCONECTED" event to all the sockets connected to this "io" session, meaning, all users connected to the "chatApp".
      io.emit(USER_DISCONNECTED, connectedUsers);
      io.emit(USER_DISCONNECTED, connectedUsers);
      //Test console.
      //   console.log("Someone disconnected. Now available: ", connectedUsers);
    }
  });

  //User logsout.
  socket.on(LOGOUT, () => {
    //This runs the "removeUser" function which will take the logged out user out of the logged users object from this socket connection.
    connectedUsers = removeUser(connectedUsers, socket.user.name);
    //This emit broadcasts "USER_DISCONECTED" event to all the sockets connected to this "io" session, meaning, all users connected to the "chatApp".
    io.emit(USER_DISCONNECTED, connectedUsers);
    //Test console.
    // console.log("Someone loggedout. Now available: ", connectedUsers);
  });

  //Get Community Chat.
  //> This endpoint is called from: "../componets/chats/ChatContainer.js"
  socket.on(COMMUNITY_CHAT, callback => {
    //This calls the passed on function with the argument "communityChat".
    //> "communityChat" is an above created const that executes an imported function(f) "createChat" from: "../Factories".
    //> This will call "resetChat" from: "../components/chats/ChatContainer.js" and pass it on the "communityChat" argument.
    callback(communityChat);
  });

  //Send message.
  socket.on(MESSAGE_SENT, ({ chatId, message }) => {
    //Test console.
    // console.log("Test for 'message' from on 'MESSAGE_SENT' endpoint: ", message);

    // Since this is a "wrapper function", we pass "chatId" and "message" arguments onto it to be able to access them later on from the inner function ("sendMessageToChat").
    sendMessageToChatFromUser(chatId, message);
  });
  
  //For when a User is typing.
  socket.on(TYPING, ({ chatId, isTyping }) => {
    //Test console.
    // console.log("Test for 'isTyping' from on 'TYPING' endpoint: ", isTyping);
    
    // Since this is a "wrapper function", we pass "chatId" and "isTyping" arguments onto it to be able to access them later on from the inner function ("sendTypingToChat").
    sendTypingToChatFromUser(chatId, isTyping);
  });
};

/*
 * Returns a function that will take a chat id and a boolean isTyping
 * and then emit a broadcast to the chat id that the sender is typing
 * @param typing user {string} username of typer.
 * @return function(chatId, message)
 */
/*
!Ok, this is somewhat complex. Let's see:
!1) We called this "sendTypingToChat" function from the "USER_CONNECTED" endpoint, passed onto it the "user" argument of "user.name" which is the user connected in the Front End (remember we are dealing with the "socket", so we will have just one connection per open tab in the Front End, differently from the "io" wich is the whole "connection session" where many users can be connected to). 
!2) But that call was then stored in the "sendTypingToChatFromUser" variable that had been created as a global variable before (so we could use it anywhere insde the module.exported function).
!3) And finally, on "TYPING" endpoint we called that "sendTypingToChatFromUser" function with "chatId" and "isTyping" arguments; this arguments are passed on precisely from the "TYPING" emission on:
> "sendTyping" function(f) declared in: "../components/chats/ChatContainer.js"
!and there is wher the "chatId" is passed on from, but, at the same time, the function is then sent as "this.props.sendTyping" into:
> "../components/messages/MessageInput.js" and used inside "sendTyping" and "stopCheckingTyping" functions(f).
!4) So we end up with the "sendTypingToChat" function with the passed argument of "user.name", nested on the Function Variable (whatever variable that stores a function becomes a Function itself) with the passed arguments of "chatId" and "isTyping", which are accesible in the "return" section of the "sendTypingToChat" function declaration.
!5) Then, from the server (thus using "io.emit" and not "socket.emit") we emit to the "TYPING-<some id>" endpoint (which will be in the Front End:
> "../components/chats/ChatContainer.js")
!and pass on the "user" (which is the "user.name") and "isTyping" values for the Front End to do whatever needed..
*/
function sendTypingToChat(user) {
  return (chatId, isTyping) => {
    //Test console.
    // console.log("Test for 'isTyping' from 'sendTypingToChat function: ", isTyping);
    
    io.emit(`${TYPING}-${chatId}`, { user, isTyping });
  };
}

/*
 * Returns a function that will take a chat id and message
 * and then emit a broadcast to the chat id.
 * @param sender {string} username of sender
 * @return function(chatId, message)
 */
/*
!Ok, this is somewhat complex. Let's see:
!1) We called this "sendMessageToChat" function from the "USER_CONNECTED" endpoint, passed onto it the "user" argument of "user.name" which is the user connected in the Front End (remember we are dealing with the "socket", so we will have just one connection per open tab in the Front End, differently from the "io" wich is the whole "connection session" where many users can be connected to). 
!2) But that call was then stored in the "sendMessageToChatFromUser" variable that had been created as a global variable before (so we could use it anywhere insde the module.exported function).
!3) And finally, on "MESSAGE_SENT" endpoint we called that "sendMessageToChatFromUser" function with "chatId" and "message" arguments; this arguments are passed on precisely from the "MESSAGE_SENT" emission on:
> "sendMessage" function(f) declared in: "../components/chats/ChatContainer.js"
!and there is wher the "chatId" is passed on from, but, at the same time, the function is then sent as "this.props.sendMessage" into:
> "../components/messages/MessageInput.js" and used inside "sendMessage" function(f).
!4) So we end up with the "sendMessageToChat" function with the passed argument of "user.name", nested on the Function Variable (whatever variable that stores a function becomes a Function itself) with the passed arguments of "chatId" and "message", which are accesible in the "return" section of the "sendMessageToChat" function declaration.
!5) Then, from the server (thus using "io.emit" and not "socket.emit") we emit to the "MESSAGE_RECIEVED-<some id>" endpoint (which will be in the Front End:
> "../components/chats/ChatContainer.js")
!and pass on the "sender" (which is the "user.name")and "message" values for the Front End to do whatever needed..
*/
function sendMessageToChat(sender) {
  return (chatId, message) => {
    io.emit(
      `${MESSAGE_RECIEVED}-${chatId}`,
      createMessage({ message, sender })
    );
  };
}

/*
 * Adds user to list passed in.
 * @param userList {Object} Object with key value pairs of Users
 * @param user {User} the user to be added to the list.
 * @return userList {Object} Object with "key:value" pairs of Users
 */
function addUser(userList, user) {
  //Test console.
  // console.log("User passed: ",user);
  // console.log("Connected Users List: ", userList);

  /*
    "Object.assign()" adds "key:value" pairs to an object. As parameters, i takes the object to add pairs to and then the object to be added. If the second object happen to have a matching value in the original object, the one from that one gets replaced.
    In this case, we are passing on an empty object ({}) and then adding to it the "userList" object, which holds all connected users. The "userList" comes in the form:
    {SomeName-1: {name: SomeName-1}, ... , SomeName-n:{name: SomeName-n}}
    */
  let newList = Object.assign({}, userList);
  //Then, since we expect the "user" parameter to have a "key:value" pair of: "name:'Some Name'", we add that to the "newList" object with an attribute that has the same name as the "users.name" using this syntax:
  newList[user.name] = user;
  //Test console.
  // console.log("New Connected Users List:\n", newList);
  //And we just return it.
  return newList;
}

/*
 * Removes user from the list passed in.
 * @param userList {Object} Object with key value pairs of Users
 * @param userName {string} name of user to be removed
 * @return userList {Object} Object with key value pairs of Users
 */
function removeUser(userList, userName) {
  //Test console.
  // console.log("User passed: ",user);
  // console.log("Connected Users List: ", userList);

  /*
    "Object.assign" adds "key:value" pairs to an object. As parameters, it takes the object to add pairs to and then the object to be added. If the second object happen to have a matching value in the original object, the one from that one gets replaced.
    In this case, we are passing on an empty object ({}) and then adding to it the "userList" object, which holds all connected users. The "userList" comes in the form:
    {SomeName-1: {name: SomeName-1}, ... , SomeName-n:{name: SomeName-n}}
    */
  let newList = Object.assign({}, userList);
  //Then we just delete the selected user ("userName") from the newly created "newList" with this syntax:
  delete newList[userName];
  //And we just return it.
  return newList;
}

/*
 * A boolean that checks if the user is in list passed in.
 * @param userList {Object} Object with key value pairs of Users
 * @param userName {String}
 * @return userList {Object} Object with key value pairs of Users
 */
function isUser(userList, userName) {
  //Test console.
  // console.log("userName:", userName);
  // console.log("userList:", userList);

  //We check whether the passed "userName" exists in the passed "userList" and return either "true" or "false".
  return userName in userList;
}
