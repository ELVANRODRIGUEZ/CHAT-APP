import React, { Component } from "react";
//Icon importing from React Icons that we will later on use in Component form.
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaListUl } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { MdEject } from "react-icons/md";

export default class SideBar extends Component {
  render() {
    const { chats, activeChat, user, setActiveChat, logout } = this.props;
    return (
      <div id="side-bar">
        {/* //~ ++++++++++ HEADER ++++++++++ */}
        {/* //This includes some dummy icons. */}
        <div className="heading">
          <div className="app-name">
            Chat App <MdKeyboardArrowDown />
          </div>
          <div className="menu">
            <FaListUl />
          </div>
        </div>
        {/* //~ ++++++++++ SEARCHER ++++++++++ */}
        {/* //This includes dummy searcher. */}
        <div className="search">
          <i className="search-icon">
            <FaSearch />
          </i>
          <input placeholder="Search" type="text" />
          <div className="plus" />
        </div>
        {/* //~ ++++++++++ CHATS ++++++++++ */}
        {/* //This includes the Chat List. */}
        {/* //! Right now there is just one chat called "Community". */}
        <div
          className="users"
          ref="users"
          onClick={e => {
            //If we click anywhere outside a Chat Tag, the Active Chat will be cleared out by triggering "setActiveChat" with "null" argument passed on.
            e.target === this.refs.users && setActiveChat(null);
          }}
        >
          {/* //This will mapp all the available chats. */}
          {chats.map(chat => {
            //If the "chat" item has a name, it will keep on, otherwise it will return "null".
            if (chat.name) {
              //Since each "chat" item is storing its own messages within an array of objects attribute, we well retrive the last message and store it in "lastMessage" const.
              const lastMessage = chat.messages[chat.messages.length - 1];
              //! "user" const will store the first name inside the "chat.users" array that pass the test of not being the "this.props.name" User (that is why ".find() method is used for").
              //! Since are not managing "users" inside the Chats right now, we will pass the key pair "name: 'Community'" for now.
              const user = chat.users.find(({ name }) => {
                return name !== this.props.name;
              }) || { name: "Community" };
              const classNames =
                //! Again, while this does not make much sense for how the app is right now, this just store the string "active" or "" dependig on if this item "chat.id" is the same as the "activeChat.id". 
                activeChat && activeChat.id === chat.id ? "active" : "";

              return (
                <div
                  key={chat.id}
                  className={`user ${classNames}`}
                  //This will call "setActiveChat" function.
                  //> Imported as "prop" from: "./ChatContainer".
                  onClick={() => {
                    setActiveChat(chat);
                  }}
                >
                  <div className="user-photo">{user.name[0].toUpperCase()}</div>
                  <div className="user-info">
                    <div className="name">{user.name} Chat</div>
                    {lastMessage && (
                      //Showing the "message" attribute of the above declared "letMessage" const.
                      <div className="last-message">{lastMessage.message}</div>
                    )}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        {/* //~ ++++++++++ LOGGED USER TAG ++++++++++ */}
        {/* //This show the logged user. */}
        <div className="current-user">
          <span>{user.name}</span>
          <div
            //> This triggers the "logout" function(f) imported as prop from: "./ChatContainer"
            onClick={() => {
              //This function reference migth as well have had the form "onClick=this.props.logout".
              logout();
            }}
            title="Logout"
            className="logout"
          >
            <MdEject />
          </div>
        </div>
      </div>
    );
  }
}
