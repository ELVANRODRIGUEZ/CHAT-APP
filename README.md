## SIMPLE CHAT-APP
---

* This is a follow up excercise to create a chat app from the series: https://www.youtube.com/playlist?list=PLfUtdEcvGHFHdOYFXj4cY6ZIFkSp6MOuY
* The project, how it is now, covers chapters 1 and 2, and adds a Chat logged users counter in the "ChatHeading". Everythin else is exactly the same as the project at the end of the above mentioned secon chapter.

SRC (PROJECT JAVASCRIPT AND REACT LOGIC) IS STRUCTURED AS FOLLOWS:

1. __Events.js:__ Just a module that exports event names so there is just once source of them.

2. __Factories.js:__ A file that exports the logic to create users, messages and tasks, all of them identified with the npm UUIdv4 package.

3. __App.js:__ A component general container.

4. __index.js:__ The React-Dom integrator.

5. __test.js:__ Just a test file to run in Node whenever needed.

### components

This constitutes the Front End React Component manager for the app.

1. __Layout.js:__ The node that will either direct the user to the chat or ask him/her to login. This components opens the io.socket for the Client to start lisening and emiting from it. Gets the users once they login and keep store them into JSON obects. No persistance present in this app. Also, it checks when a user logs out and reshape the corresponding JSON object.

2. __LoginForm.js:__ A component to allow the user to input the name.

3. __chats(folder)__

     -*ChatContainer.js:* Manages messages emission/reception. Like the "messages controller". It listens to message send and recieving through the passed socket.
     -*ChatHeading.js:* Just a top ribbon to show the connected users count.
     -*SideBar.js:* A left positioned container that shows the availbale chats and the connected user. It will hopefuly have the logic to create new chatrooms.

4. __messages(folder)__

     -*MessageInput.js:* If *ChatContainer.js* if the "messages controller", this component is the "messages generator" and the "is typing" message generator.
     -*Messages.js:* This is just the "messages positioner" that shows each message in its correspondant place and scrolls down to reveal new ones.

### server

1. __index.js:__ This gets the server and io.socket up and running.

2. __SocketManager.js:__ As it name implies, it manages the socket endpoints to listen to client emissions and viceversa.

