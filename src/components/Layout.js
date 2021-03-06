import React, { Component } from "react";
import io from "socket.io-client";
import { USER_CONNECTED, USER_DISCONNECTED, LOGOUT } from "../Events";
import LoginForm from "./LoginForm";
import ChatContainer from "./chats/ChatContainer";

//We take the URL the socket will be listening to.
const PORT = process.env.PORT || 3231;
const socketUrl = `http://localhost:${PORT}`;

export default class Layout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //"socket" will store the particular "socket session".
      socket: null,
      //"user" will store the logged user and pass it on to other components.
      user: null,
      connectedUsers: {}
    };
  }

  /*
    This was originally "componentWillMount", although it seemps it is depricated now, so it was renamed to componentDidMount. "UNSAFE_componentWillMount" could have been used as well according to the React development team recommendation.
    Right after the component has mounted and before it is rendered, we initialize the socket with "this.initSocket".
    */
  componentDidMount() {
    this.initSocket();
  }

  initSocket = () => {
    //Calling the "io" function imported from "socket.io-client" and we pass the URL to listen to onto it.
    const socket = io(socketUrl);
    //Then we trigger a connect event after which we set "this.state.socket" equals to the by then listening socket.
    socket.on("connect", () => {
      //Production console.
      console.log("Socket connected");
    });
    //This is a syntax to avoid this redundancy: "this.setState({socket:socket})"
    this.setState({ socket });
  };

  //A function to send a user to the "USER_CONNECTED" endpoint.
  //> this function gets triggered from(f) "setUser" from: "../LoginForm.js"
  setUser = user => {
    //This is just a cleaned up way to user the "socket". Instead of "this.state.socket.emit...", we bring it into a "const" named "socket" and use the inherited method "emit".
    const { socket } = this.state;
    socket.emit(USER_CONNECTED, user);
    //Then the "user" state gets changed into the "user" passed on as argument.
    this.setState({ user });

    //This socket recieves emssion from the server:
    //> "../server/SocketManager.js"
    //and gets back "connectedUsers" object. By being here in this function whenever a new user is logged on, we immediately get a response from the server emission "USER_CONNECTED" because "USER_CONNECTED" endpoint has it in its declaration.
    socket.on(USER_CONNECTED, connectedUsers => {
      //The "connectedUsers" object gotten from the server emmsion, we assign to "this.state.connectedUser".
      this.setState({ connectedUsers }, () => {
        //Test console.
        // console.log(connectedUsers);
      });
    });
    //Finally, we call "removeConnectedUsers" which holds the "USER_DISCONNECTED" endpoint to just open it up.
    this.removeConnectedUsers();
  };

  //Opens up the "USER_DISCONNECTED" endpoint to refresh "this.state.connectedUsers" when some other users loggs out.
  removeConnectedUsers = () => {
    //Cleaned up way to use "this.state.socket" available methods.
    const { socket } = this.state;

    //"USER_DISCONNECTED" endpoint.
    socket.on(USER_DISCONNECTED, connectedUsers => {
      //Assigning "this.state.connectedUsers" the "connectedUsers" object we get as response. 
      this.setState({ connectedUsers }, () => {
        //Test console.
        // console.log(this.state.connectedUsers);
      });
    });
  };

  //Logs the user out.
  logout = () => {
    //Cleaned up way to use "this.state.socket" available methods.
    const { socket } = this.state;
    //Emits "LOGOUT" to handle the current user taking out in the server.
    socket.emit(LOGOUT);
    //Sets the current user state to "null".
    this.setState({ user: null });
  };

  render() {
    const { socket, user, connectedUsers } = this.state;
    return (
      <div className="container">
        {/* //The "ChatContainer" component will only show if there has been a logged in. Otherwise the "LoginFrom" component will show up." */}
        {!user ? (
          <LoginForm socket={socket} setUser={this.setUser} />
        ) : (
          <ChatContainer
            socket={socket}
            user={user}
            logout={this.logout}
            connectedUsers={connectedUsers}
          />
        )}
      </div>
    );
  }
}
