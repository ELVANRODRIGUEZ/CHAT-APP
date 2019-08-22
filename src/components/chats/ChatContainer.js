import React, { Component } from "react";
import SideBar from "./SideBar";
import {
  COMMUNITY_CHAT,
  MESSAGE_SENT,
  MESSAGE_RECIEVED,
  TYPING,
} from "../../Events";
import ChatHeading from "./ChatHeading";
import Messages from "../messages/Messages";
import MessageInput from "../messages/MessageInput";

export default class ChatContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //"chats" stores the opened chats, while "activeChat" stores the active one.
      chats: [],
      activeChat: null
    };
  }

  componentDidMount() {
    //This inherits the particular "socket session".
    //> "socket" imported from: "../Layout.js".
    const { socket } = this.props;
    //We call the "COMMUNITY_CHAT" endpoint and pass on the function argument "this.resetChat".
    socket.emit(COMMUNITY_CHAT, this.resetChat);
  }

  //This will call the "this.addChat" function, which takes a "chat" parameter.
  // This gets called as a callback function from the "COMMUNITY_CHAT" endpoint logic with the "communityChat" parameter.
  //> COMMUNITY_CHAT endpoint imported from: "../../Events" and will eventually reach the: "../../server/SocketManager.js".
  resetChat = chat => {
    //Returns "this.addChat" function with the passed on argument ("communityChat") and the value "true" or "false".
    return this.addChat(chat, false);
  };

  //This adds chats to the "chats" array.
  addChat = (chat, reset) => {
    //Test console.
    // console.log(chat);
    // console.log(this.state.chats);

    const { socket } = this.props;
    const { chats } = this.state;

    //Tests whether a new chat is added or the entire "chat" array will be reseted. By pasing "true" or "false" on the "addChat" function, this const either adds new chat or resets the "chat" array.
    const newChats = reset ? [chat] : [...chats, chat];
    //This assigns to the "state chats" the "newChat" constant and the "state activeChat" to the "chat" passed on as argument or leaves the same value if "reset" boolean argument as "false".
    this.setState({
      chats: newChats,
      activeChat: reset ? chat : this.state.activeChat
    });

    //This will build a "messageEvent" name event to trigger the corrensponding endpoint.
    const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`;
    //This will build a "typingEvent" name event to trigger the corrensponding endpoint.
    const typingEvent = `${TYPING}-${chat.id}`;

    /*
    The emission from the sockets can be done from the Front End or from the Back End. In this case and by using "socket.on" we are opening and endpoint to the emisson from the Back End (most likely: "io.emit", since the server will send the emission to all sockets connected to that "io" session).
    */
    //> This emission comes from: "../../server/SocketManager"
    //We trigger the above created events and pass on "this.updateTypingInChat" function as only argument with "chat.id" as only argument for it.
    socket.on(typingEvent, this.updateTypingInChat(chat.id));
    //> This emission comes from: "../../server/SocketManager"
    //We trigger the above created events and pass on "this.addMessageToChat" function as only argument with "chat.id" as only argument for it.
    socket.on(messageEvent, this.addMessageToChat(chat.id));
  };

  addMessageToChat = chatId => {
    return message => {
      const { chats } = this.state;
      let newChats = chats.map(chat => {
        if (chat.id === chatId) chat.messages.push(message);
        return chat;
      });

      this.setState({ chats: newChats });
    };
  };

  /*
  !This will update the typing status of the user. Again, is somewhat coplex. Let's review this:
  !1) This function is called when recieving the "typingEvent" ("TYPING-<Some Id>") event emission from the server and with a passed argument of "chat.id". 
  !2) That emission comes with a returned object with two attributes: "user" and "isTyping", both with empty values, although "user" was assigned the logged "user.name" at whatever socket endpoint, since it was taken from the "USER_CONNECTED" endpoint where a real name coming from the Front End is recieved, so back into here we can evaluate that "user" as done in the first "if" statement.
  */
  updateTypingInChat = chatId => {
    //We use the nested "isTyping" and "user" arguments passed on from the "io.emit" in the Back End.
    return ({ isTyping, user }) => {
      //Test console.
      // console.log("Test for 'isTyping' from 'updateTypingInChat function: ", isTyping);
      // console.log(
      //   "Test for 'this.state.chats' from 'updateTypingInChat function: ",
      //   this.state.chats
      // );

      //Test if that "user" is equal to the "user" of this socket session.
      if (user !== this.props.user.name) {
        //If it is, we keep on. We use the "chats" array (this.state.chats) that stores all the available chats.
        const { chats } = this.state;
        let newChats = chats.map(chat => {
          //We map that "chats" array into a new array called "newChats" thesting whether the "id" from each chat within the "chats" array is egual the the Chat Id ("chatId") passed on into this function.
          if (chat.id === chatId) {
            //If chats Id's match, we keep on and test whether some user in the same Chat is typing ("isTyping") and if that user is not in the "chat.typingUsers" array. This ".
            if (isTyping && !chat.typingUsers.includes(user)) {
              //Either we push the "user"...
              chat.typingUsers.push(user);
            } else if (!isTyping && chat.typingUsers.includes(user)) {
              //Or filter the "user" out.
              chat.typingUsers = chat.typingUsers.filter(u => u !== user);
            }
          }
          //Returning the "chat" items with the
          return chat;
        });

        //Then we just reassign value to the "chats" state.
        this.setState({ chats: newChats }, () => {
          //Test console.
          // console.log("Test for 'this.state.chats' from 'updateTypingInChat function:", this.state.chats);
        });
      }
    };
  };

  //> This function will be called in: "../messages/MessageInput", from where it gets the "message" argument.
  sendMessage = (chatId, message) => {
    //A clean way to use the inherited "socket" to emit to the "MESSAGE_SENT" endpoint with an object argument holding "chitId" and "message".
    const { socket } = this.props;
    socket.emit(MESSAGE_SENT, { chatId, message });
  };

  //> This function will be called in: "../messages/MessageInput", from where it gets the "message" argument.
  sendTyping = (chatId, isTyping) => {
    //A clean way to use the inherited "socket" to emit to the "TYPING" endpoint with an object argument holding "chitId" and "isTyping".
    const { socket } = this.props;
    socket.emit(TYPING, { chatId, isTyping });
  };

  //At Chat Lable pressing on the "SideBar", this takes in that Chat Lable Name as argument and set "this.state.activeChat" to it.
  //> This Function(f) is called in "./SideBar" "setActiveChat" Function(f).
  setActiveChat = activeChat => {
    this.setState({ activeChat });
  };

  render() {
    const { user, connectedUsers, logout } = this.props;
    const { chats, activeChat } = this.state;
    return (
      <div className="container">
        <SideBar
          //> This "logout" function(f) is imported from: "../Layout".
          logout={logout}
          chats={chats}
          user={user}
          activeChat={activeChat}
          setActiveChat={this.setActiveChat}
        />
        <div className="chat-room-container">
          {activeChat !== null ? (
            //If there is an activeChat, the following will render:
            <div className="chat-room">
              <ChatHeading
                //Passing on the "activeChat" "name" attribure and the number of items of the "connectedUsers" object to show it in the ChatHeading.
                name={activeChat.name}
                numberOfUsers={Object.keys(connectedUsers).length}
              />
              <Messages
                //Passing the whole "messages" array attribute of the "activeChat" object; the logged "user" and the users that are/will be typing at any given moment.
                messages={activeChat.messages}
                user={user}
                typingUsers={activeChat.typingUsers}
              />
              <MessageInput
                //! This "prpos" syntax means that the "prop" is being assigned "this.sendMessage" function, for which we will 'prefill' an argument of "activeChat.id" and expect a second "message" argument that will be passed on at calling time inide the "child" Component. In other words, when the "child" Component calls "this.props.sendMessage" function it will accept an argument ("message") that will then be passed on as a second argument here in the "this.sendMessage" function.
                sendMessage={message => {
                  this.sendMessage(activeChat.id, message);
                }}
                //! Same thing as in "sendMessage" "prop".
                sendTyping={isTyping => {
                  this.sendTyping(activeChat.id, isTyping);
                }}
              />
            </div>
          ) : (
            //If there is not an activeChat, this will render:
            <div className="chat-room-choose">
              <h3>Choose a Chat</h3>
            </div>
          )}
        </div>
      </div>
    );
  }
}
